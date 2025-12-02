// src/utils/crypto.js
const crypto = require('crypto');

const ALGO = 'aes-256-gcm';

function encrypt(text, secret) {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(secret).digest();
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    iv: iv.toString('hex'),
    content: encrypted,
    authTag
  };
}

function decrypt(encryptedData, secret) {
  const { iv, content, authTag } = encryptedData;
  const key = crypto.createHash('sha256').update(secret).digest();
  const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt
};
