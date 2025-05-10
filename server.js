// server.js
import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { getLatestBlock, verifyCertificateHash } from './blockchain.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // You can customize the filename as needed
  }
});
const upload = multer({ storage: storage });

// Route to get the latest Ethereum block number
app.get('/block', async (req, res) => {
  const blockNumber = await getLatestBlock();
  if (blockNumber !== null) {
    res.json({ latestBlock: blockNumber });
  } else {
    res.status(500).json({ error: 'Failed to fetch latest block' });
  }
});

// Route to handle certificate upload and verification
app.post('/upload', upload.single('certificateFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Placeholder: Extract hash from the uploaded certificate
  // Implement your actual logic to extract and verify the certificate hash
  const certificateHash = 'dummy_hash';

  const isValid = await verifyCertificateHash(certificateHash);
  res.json({ valid: isValid });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
