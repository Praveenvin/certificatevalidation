// server.js
import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { getLatestBlock, verifyCertificateHash } from './blockchain.js';
import { extractTextAndQR } from './utils/ocr.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST: Upload + OCR + QR + Validation
app.post('/upload', upload.single('certificateFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filePath = req.file.path;
    const { extractedText, qrCode } = await extractTextAndQR(filePath);

    const isValid = await verifyCertificateHash('dummy_hash'); // You can pass extracted data here for hash lookup

    res.json({
      valid: isValid,
      studentName: extractedText.studentName,
      course: extractedText.courseName,
      certificateTitle: extractedText.certificateTitle,
      qrData: qrCode || 'No QR code found'
    });
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Failed to process certificate' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
