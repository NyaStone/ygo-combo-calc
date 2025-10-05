import fs from 'fs';
import express from 'express';
import path from 'path';
const app = express();
const rootDir = path.dirname(process.argv[1]);


const clientBundlePath = process.env.CLIENT_BUNDLE_PATH ? path.join(rootDir, process.env.CLIENT_BUNDLE_PATH) : undefined;

if (clientBundlePath && !fs.existsSync(clientBundlePath)) {
  console.warn(`Warning: CLIENT_BUNDLE_PATH "${clientBundlePath}" does not exist. Static files will not be served.`);
}
else if (clientBundlePath) {
  // Check if the directory exists before serving
  console.log('Serving static files from:', clientBundlePath);
  app.use(express.static(clientBundlePath));
}

// health check endpoint
app.get('/api/healthcheck', (req, res) => {
  res.json({ message: 'Server is healthy!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
