// const express = require('express');
// const bodyParser = require('body-parser');
// const nacl = require('tweetnacl');
// const { PublicKey } = require('@solana/web3.js');

// const app = express();
// app.use(bodyParser.json());

// // Mock storage for user connections
// const userConnections = {};

// app.post('/api/connect', (req, res) => {
//   const { network, wallet } = req.body;
//   // Store user connection info in the backend
//   userConnections[wallet] = { network, publicKey: null, message: null };
//   res.json({ success: true, message: `Selected ${wallet} on ${network}` });
// });

// app.post('/api/generate-message', (req, res) => {
//   const { publicKey } = req.body;
//   const timestamp = Date.now();
//   const nonce = Math.random().toString(36).substring(2);
//   const message = `Timestamp: ${timestamp}, Nonce: ${nonce}, PublicKey: ${publicKey}`;
//   userConnections[publicKey].message = message;
//   res.json({ message });
// });

// app.post('/api/verify-signature', (req, res) => {
//   const { publicKey, message, signature } = req.body;
//   const key = new PublicKey(publicKey);
//   const encodedMessage = new TextEncoder().encode(message);
//   const isValid = nacl.sign.detached.verify(
//     encodedMessage,
//     new Uint8Array(signature),
//     key.toBytes()
//   );
//   res.json({ isValid });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));










// const express = require('express');
// const bodyParser = require('body-parser');
// const { PublicKey } = require('@solana/web3.js');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());

// app.post('/verify-signature', (req, res) => {
//   const { publicKey, message, signature } = req.body;

//   try {
//     const key = new PublicKey(publicKey);
//     const encodedMessage = new TextEncoder().encode(message);
//     const signatureBuffer = Buffer.from(signature, 'base64');

//     const isValid = key.verify(encodedMessage, signatureBuffer);

//     res.json({ valid: isValid });
//   } catch (error) {
//     res.status(400).json({ valid: false, error: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



const express = require('express');
const bodyParser = require('body-parser');
const { PublicKey } = require('@solana/web3.js');
const nacl = require('tweetnacl');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

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
