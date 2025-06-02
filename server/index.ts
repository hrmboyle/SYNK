// server/index.ts
import express, { type Request, Response, NextFunction } from "express";
import http from 'http'; // Import http module
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite"; // Assuming these are for local dev

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Your custom logging middleware (this is fine for serverless too)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  // @ts-ignore TODO: Fix typing for ...args if necessary
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    // @ts-ignore
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) { // Only log /api requests or as needed
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine); // Your custom log function
    }
  });
  next();
});

// This function will configure the app but not start listening
// It's important that registerRoutes MODIFIES the app instance.
// If registerRoutes used to return an http.Server, that logic needs to be handled carefully.
// For serverless, we just need the configured 'app'.
async function configureApp(currentApp: express.Express) {
  // The original code had `const server = await registerRoutes(app);`
  // We need to understand what `server` was. Assuming `registerRoutes` primarily
  // adds routes to `currentApp`. If it returned an `http.Server` instance
  // that was used for `listen`, we'll handle listening separately for local dev.
  await registerRoutes(currentApp); // Ensure this configures currentApp

  // Error handling middleware (good to have)
  currentApp.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Server Error:", err.stack || err); // Log the error for debugging
    res.status(status).json({ message });
  });
}

// Configure the app instance immediately
configureApp(app);

// --- Local Development and Non-Serverless Specific Logic ---
// This block will only run if NOT in a typical Netlify Function environment
// You can use an environment variable like IS_LOCAL_SERVER to control this.
// Netlify sets NODE_ENV=production for functions, but you might also run
// production mode locally.
if (process.env.IS_LOCAL_SERVER === 'true') {
  (async () => {
    const localApp = app; // Use the already configured app
    let serverInstance = http.createServer(localApp); // Create an HTTP server instance

    if (process.env.NODE_ENV === "development") {
      log("Setting up Vite for development...");
      await setupVite(localApp, serverInstance); // setupVite might modify/use serverInstance
    } else {
      // For local production-like testing (not Netlify deployment)
      log("Serving static files for local production-like mode...");
      serveStatic(localApp);
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
}

// Export the configured app for serverless environments (like Netlify Functions)
export default app;