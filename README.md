<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:** Node.js and the Cloudflare Wrangler CLI (`npm i -g wrangler` or use `npx wrangler`).

1. Install dependencies:
   ```bash
   npm install
   ```

2. In `cloudflare-worker/`, add your Gemini key as a Worker secret (only needs to be done once per environment):
   ```bash
   cd cloudflare-worker
   npx wrangler secret put GEMINI_API_KEY
   ```

3. Start the Worker locally (defaults to `http://127.0.0.1:8787`):
   ```bash
   npx wrangler dev
   ```

4. In the project root, create `.env.local` with the Worker URL so Vite can reach it:
   ```bash
   echo "VITE_GEMINI_WORKER_URL=http://127.0.0.1:8787" > .env.local
   ```

5. In a new terminal, run the app:
   ```bash
   npm run dev
   ```

## Deploy

1. Deploy the Worker:
   ```bash
   cd cloudflare-worker
   npx wrangler deploy
   ```

   After deployment, note the returned `*.workers.dev` URL (or your custom domain) and set it as a production environment variable:
   ```bash
   wrangler secret put GEMINI_API_KEY      # if you haven’t already in production
   ```

2. In the Vite project, configure the Worker URL for the build (for example in `.env.production` or your CI environment):
   ```bash
   VITE_GEMINI_WORKER_URL=https://your-worker-subdomain.workers.dev
   ```

3. Build the site:
   ```bash
   npm run build
   ```

4. Publish the contents of the `dist/` folder to the `gh-pages` branch (or whichever branch GitHub Pages serves).

5. In your repository settings, set **Settings → Pages → Build and deployment → Source** to `Deploy from a branch`, choose the `gh-pages` branch, and keep the folder set to `/ (root)`.
