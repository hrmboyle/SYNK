// server/app.ts
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes"; // Assuming this defines your API routes
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Your API-specific middleware (like the custom logger if you want it in your function)
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) { // Only log for API paths in the function
    const start = Date.now();
    // ... (your logging middleware logic, simplified if needed for functions) ...
    // Consider if the custom `log` function from './vite.ts' is needed here
    // or if console.log/error is sufficient for function logs.
    // If `log` is from a shared utility without Vite deps, it's fine.
  }
  next();
});

// Configure your API routes
(async () => {
  await registerRoutes(app); // This should set up all your app.get, app.post, etc.
})();


// Centralized API error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("API Error:", err.stack || err); // Log to function logs
  res.status(status).json({ message });
});

export default app;