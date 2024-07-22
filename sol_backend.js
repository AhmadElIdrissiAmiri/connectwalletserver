import express from 'express';
import bodyParser from 'body-parser';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Signature Verification API');
});

app.post('/verify-signature', (req, res) => {
  console.log('Received payload:', req.body);

  const { publicKey, message, signature } = req.body;

  try {
    const key = new PublicKey(publicKey).toBytes();
    const encodedMessage = new TextEncoder().encode(message);
    const signatureBuffer = Buffer.from(signature, 'base64');
    const isValid = nacl.sign.detached.verify(encodedMessage, signatureBuffer, key);

    res.json({ valid: isValid });
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(400).json({ valid: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});