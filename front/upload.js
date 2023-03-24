document.addEventListener("DOMContentLoaded", function(event) { 

    let inputElement = document.getElementById('inputId');
    let sendButton = document.getElementById('buttonId');
    let value = inputElement.value;

    //Ask public Key
    const m = new XMLHttpRequest();
    m.open("GET", "/pk", false);
    m.send();
    m.onreadystatechange = () => {
        if (m.readyState==4) {
          if (m.status == 200) {
            console.log(m.responseText)
           }
        }
      }

});