

document.addEventListener("DOMContentLoaded", function(event) { 

    let inputElement = document.getElementById('inputId');
    let sendButton = document.getElementById('buttonId');
    let passwordDiv = document.getElementById('passwordDiv');
    let uploadDiv = document.getElementById('passwordDiv');
    

    //Ask public Key
    const m = new XMLHttpRequest();
    const n = new XMLHttpRequest();
    let cPublicKey = "";
    let cPrivateKey = "";

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