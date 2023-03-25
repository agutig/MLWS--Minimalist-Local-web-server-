import CryptoJS from './crypto-js/crypto-js.js';

document.addEventListener("DOMContentLoaded", function(event) { 

    let inputElement = document.getElementById('inputId');
    let sendButton = document.getElementById('buttonId');
    let passwordDiv = document.getElementById('passwordDiv');
    let uploadDiv = document.getElementById('passwordDiv');
    

    //Ask public Key
    const m = new XMLHttpRequest();

    sendButton.onclick = function(){
      let value = inputElement.value;
      console.log(value)
      m.open("GET", "/pk", true);
      m.onreadystatechange = () => {
          if (m.readyState==4 && m.status == 200) {
              m.open("POST", "/access", true);
              m.onreadystatechange = () => {
                if (m.readyState==4 && m.status == 200) {
                    if(m.responseText != ""){
                      uploadDiv.innerHTML = ""
                      passwordDiv.innerHTML = m.responseText
                    }
                    
                }
              }
              console.log(value)
              let encrypted = CryptoJS.AES.encrypt(message, m.responseText).toString();
              m.send(encrypted);
          }
        }
      m.send();

    }

});