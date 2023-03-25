
async function keyGenerator(){
  const keypair = await forge.pki.rsa.generateKeyPair({ bits: 2048 });
  return [forge.pki.publicKeyToPem(keypair.publicKey),forge.pki.privateKeyToPem(keypair.privateKey)] ;
}


function encrypt(input, publicKeyPem) {
    // Parsear la clave pública
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    // Convertir el mensaje a bytes
    const message = forge.util.encodeUtf8(String(input));

    // Cifrar el mensaje con RSA-OAEP
    const encrypted = publicKey.encrypt(message, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create(),
      },
    });

    const encryptedBase64 = forge.util.encode64(encrypted);
  
    return encryptedBase64;
}

function decrypt(encryptedMessageBase64, privateKeyPem) {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const encryptedMessage = forge.util.decode64(encryptedMessageBase64);
  const decryptedMessage = privateKey.decrypt(encryptedMessage, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha256.create(),
    },
  });
  const decryptedMessageText = forge.util.decodeUtf8(decryptedMessage);
  return decryptedMessageText;
}


