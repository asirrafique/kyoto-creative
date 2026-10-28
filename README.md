# Kyoto Creative

Run from `D:\intern`:

```powershell
npm install
npm run dev -- --port 3100
```

Open http://127.0.0.1:3100. For production, run `npm run build`, then `npm start -- --port 3101`.

## Vercel performance

Use the standard **Next.js** framework preset with build command `npm run build` and the default output directory. Redeploy after these changes; the existing deployment will not update from local edits alone.

`prebuild` prepares all captured assets in a versioned `public/__static/` directory. Images, videos, fonts, CSS, and JavaScript are delivered as static files instead of running through the catch-all server function. Existing frontend URLs are rewritten directly to those files. Versioned files receive immutable caching; compatibility asset URLs have shorter browser caching. The generated directory and manifest are intentionally ignored by Git and recreated during every build. The original `reference/assets/` archive must be present in the deployment's source.

The asset preparation step losslessly moves MP4 playback metadata before the encoded media, so playback can begin without fetching the end of the file first. Encoded frames, audio, resolution, and duration remain unchanged. Byte ranges and seeking use the static file server. Large media files are excluded from server-function tracing. Unknown assets redirect to their original allowlisted public CDN rather than buffering entire videos in a function.

Decorative project videos retain `preload="none"` and start within 600 pixels of the viewport, then pause when distant or the tab is hidden. The visible hero preview and full showreel keep their existing controls and playback behavior. `node scripts/media-scheduling-check.cjs` verifies that distant loops make no initial media requests, start near the viewport, pause after leaving it, and hydrate without errors.

The captured gradient renderer is patched in `src/lib/runtime-performance.mjs`: it uses only the composer's scene draw, skips fully transparent backgrounds and hidden tabs, cancels its animation frame on disposal, and removes its resize listener correctly. Decorative WebGL canvases cap their pixel ratio at 1.5; DOM typography and layout retain the screen's full resolution. Versioned script query strings invalidate the previous captured runtime after a new build. `node scripts/profile-scroll.cjs --baseline` compares the original gradient renderer against `node scripts/profile-scroll.cjs` using the same scroll sequence at device scale 2. Results describe local headless Chrome, not a guarantee of frame rate on other devices.

Production instances reuse parsed indexes and keep a bounded cache of transformed public documents/Flight responses. Personalized query responses are excluded from this render cache, and HTML/Flight remain distinct. Previously uncaptured page variants use Vercel's writable temporary directory; that cache is instance-local and can disappear after a cold start. Media is prepared at build time and needs no writable runtime cache.

Run `node scripts/performance-check.mjs` against the production server on port 3101 (or set `REPLICA_URL`). It checks lossless fast-start, static range delivery, immutable caching, function-bundle exclusions, and HTML/Flight content types. Use `node scripts/production-check.cjs` to verify playback and interactive behavior. These local checks do not measure latency from the deployed Vercel region to a visitor's network.

## What this project contains

This is a Next.js 16 App Router host for a captured KOTA frontend. It retains the original public HTML, CSS, Montreal font files, compiled React components, GSAP/ScrollTrigger/Flip animations, Lenis scrolling, WebGL backgrounds, Swiper carousels, video, and React Flight navigation responses. Keeping the matching runtime and navigation payloads preserves animated client navigation rather than replacing links with hard page reloads.

The original HTTrack download in `intern/` is preserved. The running application reads its consolidated capture from `reference/`, so the HTTrack folder is not required to run the app.

- `src/app/[[...path]]/route.js`: Next.js document, navigation, and asset routes.
- `src/lib/reference.js`: local URL mapping, document/Flight responses, streamed media with byte-range support, and a playback-race fix.
- `reference/routes.json`: 335 captured public page routes, including the sitemap and linked-page gaps.
- `reference/redirects.json`: 61 original and repaired legacy link destinations.
- `src/lib/page-cache.js`: distinct cached documents and React navigation responses for filter combinations and personalized results URLs.
- `src/lib/faq-controls.js`: keyboard/expanded-state support that retains the original 0.6-second accordion expansion, delayed opacity fade, and plus rotation.
- `src/lib/form-actions.js`: validated local enquiry, newsletter, briefing-download, and brand-quiz submissions.
- `src/lib/link-controls.js`: native ZIP/PDF handling, local internal links, and normal open-in-new-tab behavior.
- `reference/pages/`: matching HTML and React Flight responses.
- `reference/assets/`: fonts, original styles/runtime, images, and videos.
- `reports/`: visual comparisons, browser checks, scroll screenshots, and a contact sheet from the supplied recording.

## Verification

```powershell
npm run verify
```

With the development server running on port 3100, this compares the live original and local homepages at 1902×950, 1440×900, and 390×844. It checks typography and section geometry after fonts settle, horizontal overflow, images after progressive scrolling, the FAQ accordion, animated navigation, and browser Back. Results are in `reports/verification.json`.

The test uses the installed Windows Chrome. Set `CHROME_PATH` to another Chrome executable if needed. Set `REPLICA_URL` to test another running port.

`node scripts/production-check.cjs` targets production on port 3101 and checks menu, showreel, carousels, video range responses, and homepage loading with external browser requests blocked.

`node scripts/routes-check.cjs` checks every captured HTML/Flight route and renders representative deeper pages. `node scripts/motion-check.cjs` checks WebGL motion, smooth wheel scrolling, and pinned scroll animations. To refresh the public capture later, run `python scripts/sync-reference.py` with internet access and the retained HTTrack folder present.

`node scripts/hero-video-check.cjs` verifies the hero's muted looping preview, original full showreel with sound, viewport crop, advancing playback, close button, keyboard opening, Escape closing, and restored scrolling. The controls in `src/lib/hero-video.js` preserve the original GSAP expansion and video sources while making the visual close button directly operable.

`node scripts/interconnected-check.cjs` exercises the FAQ's intermediate animation states, multiple open answers, combined project filters, blog category filters, nested menu links, form submissions, persisted local receipts, and the real briefing ZIP download. `node scripts/brand-pulse-check.cjs` completes the seven-step brand quiz and follows its personalized results link.

The complete public sitemap is covered by captured pages or redirects; see `reports/sitemap-coverage.json`. Internal absolute links are localized in both HTML and React navigation data. Flight text-record byte lengths are recalculated after rewriting, preventing partially hydrated pages that look static.

`node scripts/hydration-audit.cjs` checks that every captured page initializes its React layout. This catches a successful HTML response whose interactive frontend fails to start.

The full audit initialized all 335 pages. The two creative-web-design URL variants emit the same recoverable React warnings as the live original; the audit records both sets explicitly in `reports/hydration-audit.json` rather than hiding them. All other audited pages initialized without page errors.

## Scope and limitations

The original editable React/TypeScript source was not supplied. This preserves its **compiled frontend**, hosted by a new Next.js application; it is not a reconstruction into editable section components. Visual/content edits should account for both the captured HTML/Flight data and compiled components.

Homepage media and principal-page dependencies are cached locally. Allowlisted fallbacks download and cache previously unvisited deep-page assets and public query variants on first use, so those first visits can require internet access. Browser credentials are never forwarded. The capture is not a live CMS.

Forms validate inputs and save real local records and attachments under `data/submissions/<receipt-id>/`. That folder is ignored by Git. Briefing submissions unlock the original ZIP, and the brand quiz opens personalized results. Success copy explicitly states that email/newsletter delivery is not connected. The original site's private email, CRM, CMS, and newsletter services are not included, and no original production form submission is forwarded. Analytics are disabled. External destinations such as social profiles remain external links.

Some legacy links on the original return 404; known service and landing-page links are repaired to their current equivalents locally. Original redirects are retained. Runtime fidelity is verified for the homepage and tested interactions; it is not a guarantee that every frame, viewport, device, deep-page interaction, or external integration is identical.
