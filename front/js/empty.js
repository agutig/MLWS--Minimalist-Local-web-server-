
let access_pswd = ""

function loadNewjs(urlFile){
  
    // Crear una etiqueta de script dinámicamente
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = urlFile;

    // Añadir la etiqueta de script a la cabecera HTML
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
    }

function loadNewCss(url) {
    // Crear una etiqueta de enlace dinámicamente
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;

    // Añadir la etiqueta de enlace a la cabecera HTML
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
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
            //console.log(response)
            document.body.innerHTML = response[0]
            access_pswd = pswd
            loadNewCss(response[1])
            loadNewjs(response[2])
        })
        .catch(error => {
            console.log("error")
        });

}
