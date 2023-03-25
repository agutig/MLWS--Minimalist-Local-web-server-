

document.addEventListener("DOMContentLoaded", function(event) { 

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

    // Convertir el mensaje cifrado a base64
    const encryptedBase64 = forge.util.encode64(encrypted);
  
    return encryptedBase64;
  }


    let inputElement = document.getElementById('inputId');
    let sendButton = document.getElementById('buttonId');
    let passwordDiv = document.getElementById('passwordDiv');
    let uploadDiv = document.getElementById('passwordDiv');
    

    //Ask public Key
    const m = new XMLHttpRequest();
    const n = new XMLHttpRequest();


    sendButton.onclick = function(){
      let value = inputElement.value;
      console.log(value)
      m.open("GET", "/pk", true);
      m.onreadystatechange = () => {
        if (m.readyState==4 && m.status == 200) {
          console.log(m.responseText) 
          n.open("POST", "/access", true);
          n.onreadystatechange = () => {
            if (n.readyState==4 && m.status == 200) {
                if(n.responseText != ""){
                  uploadDiv.innerHTML = ""
                  passwordDiv.innerHTML = n.responseText
                }
                
            }
          }
          encryptedMessage = encrypt(value, m.responseText)
          console.log(encryptedMessage);
          n.send(encryptedMessage);
        
        }
      }
      m.send();

    }

});