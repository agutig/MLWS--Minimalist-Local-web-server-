document.addEventListener("DOMContentLoaded", function(event) { 

    let inputElement = document.getElementById('inputId');
    let sendButton = document.getElementById('buttonId');
    let value = inputElement.value;

    console.log(sendButton)
    sendButton.onclick = function(){
        console.log("click")
        fetch('access', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            key1: value
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        })
    }

});