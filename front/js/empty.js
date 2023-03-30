
let access_pswd = ""

function loadnewjs(urlFile){
    // Crear una etiqueta de script dinámicamente
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = urlFile;

    // Añadir la etiqueta de script a la cabecera HTML
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
    }


function next(url,pswd){
    const headers = new Headers();
    headers.append('Authorization', pswd);

    fetch(url, {
        method: 'POST',
        headers: headers,
        body: ""
        })
        .then(response => response.text())
        .then(response => {
            response = JSON.parse(response)
            console.log(response)
            document.documentElement.innerHTML = response[0]
            access_pswd = pswd
            loadnewjs(response[2])
        })
        .catch(error => {
            console.log("error")
        });

}
