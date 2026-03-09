/**
 * Vercel Serverless Function entry point.
 * Imports the Express app and exports it as a handler.
 * Vercel will invoke this for all /api/* requests (as configured in vercel.json).
 */
import app from '../server/index.js';

export default app;
