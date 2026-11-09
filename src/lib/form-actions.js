import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const actions = new Map([
  ['ed9936b7e6c93f4df39adc7b63f53de659104e89', 'enquiry'],
  ['5f1641331adeb60d534eb715226dd77da7836f44', 'newsletter'],
  ['522e4757aafd927ed9d5ed60da59bcaa0ccfa105', 'briefing'],
  ['eb52bba336811ab89a9d87fa4bb66ed1075776a9', 'brand-pulse'],
]);
const limit = 16 * 1024 * 1024;
const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY || 'd223bfe0-784d-49ba-b0c8-67da38c9996a';

const interestLabels = {
  '1.1': 'A new website',
  '1.2': 'Branding',
  '1.3': 'Motion graphics',
  '1.4': 'E-Commerce',
  '1.5': 'App Development',
  '1.6': 'AI Automations',
};

function flightResult(state) {
  // The captured Next client expects [actionResult, [buildId, flightData]].
  // No route patch is required: useFormState renders its existing success view.
  return new Response('0:' + JSON.stringify([state, [null, null]]) + '\n', {
    headers: { 'Content-Type': 'text/x-component', 'Cache-Control': 'no-store' },
  });
}

function failure(message) {
  return flightResult({ status: 'failed', message, buttonText: 'Try again' });
}

async function boundedForm(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Please complete the form.');
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) {
      await reader.cancel();
      throw new Error('Attachments must total less than 16 MB.');
    }
    chunks.push(value);
  }
  return new Request(request.url, {
    method: 'POST', headers: { 'Content-Type': request.headers.get('content-type') }, body: Buffer.concat(chunks),
  }).formData();
}

async function sendToWeb3Forms({ kind, fields, attachments, route }) {
  try {
    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('subject', `New ${kind === 'enquiry' ? 'Client Enquiry' : kind} from Kyoto Creative Website`);
    formData.append('from_name', 'Kyoto Creative Contact Form');
    formData.append('replyto', fields.email || '');

    // Form fields
    const name = [fields.firstName, fields.lastName].filter(Boolean).join(' ') || fields.name || 'Anonymous';
    formData.append('name', name);
    formData.append('first_name', fields.firstName || '');
    formData.append('last_name', fields.lastName || '');
    formData.append('email', fields.email || '');

    if (fields.budget) formData.append('budget', fields.budget);
    if (fields.message) formData.append('message', fields.message);

    // Map interest codes to readable text
    if (fields.interestedIn) {
      const interests = Array.isArray(fields.interestedIn) ? fields.interestedIn : [fields.interestedIn];
      const readableInterests = interests.map(val => interestLabels[val] || val).join(', ');
      formData.append('services_interested_in', readableInterests);
    }

    if (fields.newsletter) formData.append('newsletter_opt_in', 'Yes');
    if (fields.why_download) formData.append('why_download', fields.why_download);
    if (fields.pageTitle) formData.append('page_title', fields.pageTitle);
    if (fields.pageUrl || route) formData.append('page_url', fields.pageUrl || route);

    // Attachments forwarding
    for (const file of attachments) {
      formData.append('attachment', file, file.name);
    }

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json().catch(() => null);
    return { ok: response.ok && result?.success !== false, result };
  } catch (error) {
    console.error('Web3Forms dispatch error:', error);
    return { ok: false, error: error.message };
  }
}

export async function formActionResponse(request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host') || new URL(request.url).host;
  if (origin && new URL(origin).host !== host) return new Response('Invalid form origin', { status: 403 });
  const action = request.headers.get('next-action');
  const kind = actions.get(action);
  if (!kind) return new Response('Unknown form action', { status: 404 });
  let form;
  try { form = await boundedForm(request); } catch (error) { return failure(error.message); }
  const fields = Object.create(null);
  const attachments = [];
  for (const [encodedName, value] of form) {
    // React encodeReply wraps the submitted FormData in a numbered argument.
    const name = encodedName.replace(/^\d+_/, '');
    if (name.startsWith('$') || !/^[a-zA-Z][\w-]*$/.test(name)) continue;
    if (typeof value !== 'string') {
      if (value.size) attachments.push(value);
      continue;
    }
    if (Object.hasOwn(fields, name)) fields[name] = [...(Array.isArray(fields[name]) ? fields[name] : [fields[name]]), value];
    else fields[name] = value.trim();
  }
  const email = fields.email;
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return failure('Please enter a valid email address.');
  if (!fields.privacy) return failure('Please accept the privacy policy.');
  if (['enquiry', 'newsletter'].includes(kind) && (!fields.firstName || !fields.lastName)) return failure('Please enter your first and last name.');
  if (kind === 'briefing' && !fields.why_download) return failure('Please choose why you are downloading the brief.');
  if (kind === 'newsletter' && !fields.newsletter) return failure('Please confirm the newsletter checkbox.');
  
  // Honeypot spam protection: phone field or honeypot checkbox
  if (fields.phone || (Array.isArray(fields.interestedIn) ? fields.interestedIn : [fields.interestedIn]).includes('1.8')) {
    return failure('Unable to submit this form.');
  }

  // Submit to Web3Forms
  const web3Result = await sendToWeb3Forms({
    kind,
    fields,
    attachments,
    route: new URL(request.url).pathname,
  });

  const id = crypto.randomUUID();
  const folder = path.join(process.cwd(), 'data/submissions', id);
  try {
    await fs.mkdir(folder, { recursive: true });
    const files = [];
    for (const [index, file] of attachments.entries()) {
      const filename = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, '_');
      await fs.writeFile(path.join(folder, index + '-' + filename), Buffer.from(await file.arrayBuffer()));
      files.push({ filename, size: file.size, type: file.type });
    }
    await fs.writeFile(path.join(folder, 'submission.json'), JSON.stringify({
      id, kind, createdAt: new Date().toISOString(), route: new URL(request.url).pathname,
      delivery: web3Result.ok ? 'web3forms-delivered' : 'web3forms-failed',
      web3Result,
      fields, attachments: files,
    }, null, 2));
  } catch (err) {
    console.error('Failed to log submission to disk:', err);
  }

  if (!web3Result.ok) {
    return failure('There was a problem sending your message. Please try again or email us directly.');
  }

  return flightResult({
    status: 'sent',
    buttonText: 'Sent!',
    message: 'Thank you! Your message has been sent successfully.',
    receiptId: id,
  });
}
