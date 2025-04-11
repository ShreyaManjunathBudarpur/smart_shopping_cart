import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the server URL, or ask for manual input
// We need to use the Replit domain for mobile access
// Use the "webview URL" from your Replit project
const serverUrl = 'https://smart-shopping-cart-project.user-name.repl.co/welcome';

// The above URL needs to be replaced with your actual Replit domain
// which is shown in your browser when you're viewing this project
// You can find it in the URL bar or in the "Share" button of your Replit project

// Generate QR Code
async function generateQR() {
  try {
    // Options for the QR code
    const opts = {
      errorCorrectionLevel: 'H',
      type: 'png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 400
    };

    // Create the QR code
    const outputFile = path.join(__dirname, 'smart-cart-qr.png');
    await QRCode.toFile(outputFile, serverUrl, opts);
    
    console.log('QR Code has been generated successfully!');
    console.log('URL encoded:', serverUrl);
    console.log('File saved to:', outputFile);
  } catch (err) {
    console.error('Error generating QR code:', err);
  }
}

generateQR();