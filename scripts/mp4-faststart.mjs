// Lossless fast-start for ordinary, non-fragmented MP4s. Keep all encoded media
// bytes intact and update absolute sample offsets when moving moov before mdat.
export function fastStart(source) {
  function boxes(buffer, start = 0, end = buffer.length) {
    const result = [];
    while (start + 8 <= end) {
      let size = buffer.readUInt32BE(start), header = 8;
      if (size === 1) { size = Number(buffer.readBigUInt64BE(start + 8)); header = 16; }
      if (size === 0) size = end - start;
      if (size < header || start + size > end) throw new Error('Invalid MP4 box');
      result.push({ start, size, header, type: buffer.toString('ascii', start + 4, start + 8) });
      start += size;
    }
    return result;
  }
  const top = boxes(source);
  const moov = top.find(box => box.type === 'moov');
  const mdat = top.find(box => box.type === 'mdat');
  if (!moov || !mdat || moov.start < mdat.start || top.some(box => box.type === 'moof')) return source;
  const metadata = Buffer.from(source.subarray(moov.start, moov.start + moov.size));
  const containers = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl']);
  let offsets = 0;
  function visit(start, end) {
    for (const box of boxes(metadata, start, end)) {
      if (box.type === 'mvex' || box.type === 'cmov') throw new Error('Unsupported MP4 metadata');
      if (containers.has(box.type)) visit(box.start + box.header, box.start + box.size);
      if (box.type !== 'stco' && box.type !== 'co64') continue;
      const count = metadata.readUInt32BE(box.start + box.header + 4);
      const width = box.type === 'co64' ? 8 : 4;
      if (box.header + 8 + count * width > box.size) throw new Error('Invalid MP4 offsets');
      for (let i = 0; i < count; i++) {
        const position = box.start + box.header + 8 + i * width;
        const old = width === 8 ? Number(metadata.readBigUInt64BE(position)) : metadata.readUInt32BE(position);
        const next = old >= mdat.start && old < moov.start ? old + moov.size : old;
        if (width === 8) metadata.writeBigUInt64BE(BigInt(next), position);
        else metadata.writeUInt32BE(next, position);
        offsets++;
      }
    }
  }
  visit(0, metadata.length);
  if (!offsets) throw new Error('MP4 has no sample offset table');
  return Buffer.concat([
    source.subarray(0, mdat.start), metadata,
    source.subarray(mdat.start, moov.start), source.subarray(moov.start + moov.size),
  ]);
}
