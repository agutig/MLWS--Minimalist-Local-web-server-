const crypto = require('crypto');

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
  let { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // Tamaño de la clave en bits
    publicKeyEncoding: {
        type: 'pkcs1', // Formato de la clave pública
        format: 'pem' // Formato de codificación
    },
    privateKeyEncoding: {
        type: 'pkcs1', // Formato de la clave privada
        format: 'pem' // Formato de codificación
    }
  });
  
  return {publicKey , privateKey };
  
}

function toDecrypt(encryptedMessage,privateKey){

  const decryptedMessage = crypto.privateDecrypt({
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
  }, encryptedMessage);
  console.log(decryptedMessage.toString('utf8'));

  return decryptedMessage;
}
  


module.exports = {
    print_req,keyGenerator
  }