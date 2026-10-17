# HeadSnap 360

HeadSnap 360 is a Next.js starter based on the original single-page prototype in
`index.htm`. The existing HTML is used as the page markup; browser behavior is
in `public/app.js`.

## Run locally

1. Install Node.js 20.9 or newer.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Visit `http://localhost:3000`.

To create and run a production build, use `npm run build` followed by
`npm start`.

## Current prototype boundaries

- The scan progress and dashboard values are demo content; no AI or biometric
  analysis is performed.
- Uploaded photos are previewed in the browser and are not uploaded to a server.
- Webcam access is opt-in and used only for a local video preview and snapshot.
- The hairstyle overlay is illustrative, not a face-tracked virtual try-on.
- Tailwind Play CDN, Font Awesome CDN, Google Fonts, and Unsplash images require
  an internet connection. Replace these with production build-time assets before
  launch.

Before collecting or processing real biometric images, add an explicit consent
and retention policy, a secure backend, and validated analysis infrastructure.
