const forge = require('node-forge');

function print_req(req) {

    const myURL = new URL(req.url, 'http://' + req.headers['host']);
  
    if (true){
      console.log("");
      console.log("Mensaje de solicitud");
      console.log("====================");
      console.log("Método: " + req.method);
      console.log("Recurso: " + req.url);
      console.log("Version: " + req.httpVersion)
      console.log("Cabeceras: ");
  
      for (hname in req.headers)
        console.log(`  * ${hname}: ${req.headers[hname]}`);
  
      
      console.log("URL completa: " + myURL.href);
      console.log("  Ruta: " + myURL.pathname);
    }
    return myURL
  }

function keyGenerator(){

  const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
  const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
  
  return {publicKey , privateKey };
  
}

function toDecrypt(encryptedMessageBase64,privateKeyPem){

  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const encryptedMessage = forge.util.decode64(encryptedMessageBase64);

  // Desencriptamos el mensaje utilizando la clave privada
  const decryptedMessage = privateKey.decrypt(encryptedMessage, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha256.create(),
    },
  });

  // Convertimos el mensaje desencriptado a texto
  const decryptedMessageText = forge.util.decodeUtf8(decryptedMessage)

  return decryptedMessageText
}
  


module.exports = {
    print_req,keyGenerator, toDecrypt
  }