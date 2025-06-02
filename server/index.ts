// server/index.ts (for Local Development ONLY)
// This file is intended to be run directly using `tsx` for local development,
// e.g., via `npm run dev`.

import http from 'http';
import app from './app'; // Import the pure Express app from server/app.ts

// This block will only run if IS_LOCAL_SERVER is true (set in your npm run dev script)
if (process.env.IS_LOCAL_SERVER === 'true') {
  (async () => {
    // Dynamically import Vite-specific utilities only for local development
    // This prevents them from being bundled into serverless functions if this file were accidentally imported.
    const { setupVite, serveStatic, log } = await import('./vite');

    const localAppInstance = app; // Use the imported pure app
    const serverInstance = http.createServer(localAppInstance);

    if (process.env.NODE_ENV === "development") {
      log("Setting up Vite for development...");
      // Pass the Express app instance and the HTTP server instance to Vite setup
      await setupVite(localAppInstance, serverInstance);
    } else {
      // This block is for running a local production-like build (e.g. after `npm run build:server` and `npm run build`)
      // It serves static files from the Vite build output.
      log("Serving static files for local production-like mode...");
      serveStatic(localAppInstance); // `serveStatic` should configure `localAppInstance` to serve from 'dist/public' or similar
    }

    const port = process.env.PORT || 5000;
    serverInstance.listen({
      port: Number(port),
      host: "0.0.0.0",
      // reusePort: true, // Consider if truly needed, can cause issues
    }, () => {
      log(`Local server listening on http://0.0.0.0:${port}`);
    });
  })();
} else {
  // This message helps diagnose if the script is run without the necessary environment variable.
  console.warn(
    "server/index.ts was executed without 'IS_LOCAL_SERVER=true'. " +
    "The local development server will not start. " +
    "This file is intended for local development via 'npm run dev'."
  );
  // If you need to export the app for other local tooling (not Netlify Functions),
  // you could do it here, but it's generally not recommended for this file's new purpose.
  // export default app;
}

// No default export is typically needed from this file if it's only an entry point
// for `tsx server/index.ts` and not meant to be imported elsewhere.
// The Netlify function will import from `server/app.ts`.
