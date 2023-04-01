
function loadView(component,data){

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = "css/elementPreview.css";
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
    
    for (let i = 0; i < data.length; i++) {
        console.log(data[i])
        urlImage = "others/other.png"
        switch(data[i].type){
            case "pdf":
                urlImage = "others/pdfIcon.png"
                break;

            case "png":
            case "jpg":
            case "jpeg":
                urlImage = "storage/" + data[i].name + "." + data[i].type
                break;
        }
        newComponent = component.replace("replaceSource" ,urlImage)
        newComponent = newComponent.replace("replaceTittle" ,data[i].name)
        document.body.innerHTML = document.body.innerHTML.replace("<!--replaceElementPreview-->" , newComponent + "\n" + "<!--replaceElementPreview-->")
    }
}

const headers = new Headers();
headers.append('Authorization', access_pswd);

fetch("/viewMenu/viewJson", {
    method: 'POST',
    headers: headers,
    body: ""
    })
    .then(response => response.text())
    .then(response => {
        response = JSON.parse(response)
        console.log(response[0])
        console.log(response[1])
        loadView(response[0] ,response[1])
    })
    .catch(error => {
        console.log("error")
    });
