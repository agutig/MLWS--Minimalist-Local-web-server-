

document.addEventListener("DOMContentLoaded", function(event) { 

    let inputElement = document.getElementById('inputId');
    let sendButton = document.getElementById('buttonId');

    //Ask public Key
    const m = new XMLHttpRequest();
    const n = new XMLHttpRequest();
    let cPublicKey = "";
    let cPrivateKey = "";

    sendButton.onclick = function(){
      let value = inputElement.value;
      m.open("GET", "/pk", true);
      m.onreadystatechange = () => {
        if (m.readyState==4 && m.status == 200) {
          n.open("POST", "/access" + sendButton.getAttribute("url"), true);
          n.onreadystatechange = () => {
            if (n.readyState==4 && m.status == 200) {
                if(n.responseText != ""){
                  response = JSON.parse(n.responseText)
                  next(response[0],response[1])
                  n.abort()
                  m.abort()
                }
                
            }
          }
          encryptedMessage = encrypt(value, m.responseText)
          keyGenerator().then((keyPair) => {
            cPrivateKey = keyPair[1]
            cPublicKey = keyPair[0]
            n.send(JSON.stringify([encryptedMessage,cPublicKey]));
          })
        }
      }
      m.send();

    }

});


