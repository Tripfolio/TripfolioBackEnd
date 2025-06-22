const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

function generateSignature(channelSecret, uri, body, nonce) {
  const data = channelSecret + uri + JSON.stringify(body) + nonce;
  const hmac = crypto.createHmac("sha256", channelSecret);
  hmac.update(data);
  return hmac.digest("base64");
}

module.exports = {
  generateSignature,
  uuidv4,
};