import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import path from "path";

// Initialize the app
async function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        console.log(`${new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit", 
          second: "2-digit",
          hour12: true,
        })} [express] ${logLine}`);
      }
    });

    next();
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    const { setupVite } = await import("./vite.js");
    await setupVite(app, server);
  } else {
    // For production, serve static files directly
    const express = (await import("express")).default;
    const fs = await import("fs");
    const distPath = path.resolve(process.cwd(), "client/dist");
    
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }
    
    // Add catch-all handler for SPA routing in production
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send('Not found');
        }
      }
    });
  }

  return { app, server };
}

// Vercel serverless handler
let appInstance: express.Application;

async function getApp() {
  if (!appInstance) {
    const { app } = await createApp();
    appInstance = app;
  }
  return appInstance;
}

// For local development
if (!process.env.VERCEL) {
  (async () => {
    const { server } = await createApp();

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      console.log(`${new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit", 
        hour12: true,
      })} [express] serving on port ${port}`);
    });
  })();
}

// Export for Vercel
export default async function handler(req: Request, res: Response) {
  const app = await getApp();
  app(req, res);
}