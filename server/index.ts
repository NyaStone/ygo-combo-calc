import fs from 'fs';
import express from 'express';
import path from 'path';
const app = express();

// Example API endpoint
app.get('/api/hello', (req, res) => {
  console.log(req.path);
  res.json({ message: 'Hello from Express API!' });
});

const clientBundlePath = process.env.CLIENT_BUNDLE_PATH ? path.join(__dirname, process.env.CLIENT_BUNDLE_PATH) : undefined;

if (clientBundlePath && !fs.existsSync(clientBundlePath)) {
  console.warn(`Warning: CLIENT_BUNDLE_PATH "${clientBundlePath}" does not exist. Static files will not be served.`);
}
else if (clientBundlePath) {
  // Check if the directory exists before serving
  app.use(express.static(clientBundlePath));
  
  // SPA fallback: serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return;
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
