const forge = require('node-forge');

function keyGenerator(){

    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
    const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
    
    return {publicKey , privateKey };
    
  }
  
function toDecrypt(encryptedMessageBase64,privateKeyPem){

    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const encryptedMessage = forge.util.decode64(encryptedMessageBase64);
    const decryptedMessage = privateKey.decrypt(encryptedMessage, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
        md: forge.md.sha256.create(),
        },
    });
    const decryptedMessageText = forge.util.decodeUtf8(decryptedMessage)
    return decryptedMessageText
}

function encrypt(input, publicKeyPem) {
    // ChatGPT AUTO --> PROBAR
    // Parsear la clave pública
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const message = forge.util.encodeUtf8(String(input));
    const encrypted = publicKey.encrypt(message, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create(),
      },
    });
  
    const encryptedBase64 = forge.util.encode64(encrypted);
    return encryptedBase64;
  }
    
  
  
module.exports = {
    keyGenerator, toDecrypt
}