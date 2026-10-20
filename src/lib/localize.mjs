const hosts = new Set(['kota.co.uk', 'content.kota.co.uk', 'kota-content.b-cdn.net', 'prod.spline.design', 'unpkg.com']);
export function localize(text) {
  // Apply the same substitutions to server HTML, Flight data, and client modules.
  // Matching all three is essential to avoid React hydration mismatches.
  for (const host of hosts) {
    if (host !== 'kota.co.uk') text = text.replaceAll('https://' + host, '/__assets/' + host);
  }
  text = text.replaceAll('https://www.googletagmanager.com', '/__analytics');
  text = text.replaceAll('https://static.hotjar.com', '/__analytics');
  text = text.replaceAll('https://kota.co.uk/', '/');
  text = text.replaceAll('Someone from the KOTA team will be contacting you shortly. In the meantime, how about checking out some of our latest projects :', 'Your enquiry has been saved locally. Email delivery is not connected in this replica. In the meantime, explore some of our latest projects :');
  text = text.replaceAll('Keep an eye out for your first KOTA newsletter.', 'Your subscription has been saved locally. Newsletter delivery is not connected.');
  text = text.replaceAll("Follow the link below. We've also emailed it for future reference..", 'Follow the link below to view your results. Your responses have been saved locally.');
  return text;
}

