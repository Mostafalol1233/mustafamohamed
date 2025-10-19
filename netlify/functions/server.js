import serverless from 'serverless-http';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Import your routes
// This is a simplified version - adjust based on your routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add your API routes here
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export const handler = serverless(app);
