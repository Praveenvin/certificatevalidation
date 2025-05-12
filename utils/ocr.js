import Tesseract from 'tesseract.js';
import jsQR from 'jsqr';
import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';



export async function extractTextAndQR(filePath) {
  const image = await loadImage(filePath);

  // Create canvas for QR detection
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const qrCode = jsQR(imageData.data, image.width, image.height);

  // OCR text using Tesseract
  const { data: { text } } = await Tesseract.recognize(filePath, 'eng');

  const extracted = extractDetailsFromText(text);

  return {
    qrCode: qrCode ? qrCode.data : null,
    extractedText: extracted
  };
}

// Enhanced extraction logic
function extractDetailsFromText(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  const certLine = lines.find(line =>
    /certificate|certified|internship/i.test(line)
  );

  const nameLine = lines.find(line =>
    /^[A-Z][a-z]+\s[A-Z][a-z]+/.test(line) && !/certificate|internship|course/i.test(line)
  );

  const courseLine = lines.find(line =>
    /course|program|training|internship/i.test(line) && !/certificate/i.test(line)
  );

  return {
    studentName: nameLine || '',
    courseName: courseLine || '',
    certificateTitle: certLine || '',
    rawText: text
  };
}
