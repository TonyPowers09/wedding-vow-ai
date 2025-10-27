<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

1. Create a `.env` file (or set the variable in your CI pipeline) with your key:

   ```bash
   VITE_GEMINI_API_KEY=your-google-gemini-key
   ```

   > This value is bundled into the client build. Treat it as public or proxy requests through a backend if the key must stay secret.

2. Build the site:

   ```bash
   npm run build
   ```

3. Publish the contents of the `dist/` folder to the `gh-pages` branch (or the branch GitHub Pages is configured to serve).

4. In your repository settings, set **Settings → Pages → Build and deployment → Source** to `Deploy from a branch`, choose the `gh-pages` branch, and keep the folder set to `/ (root)`.
