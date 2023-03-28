
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
            console.log(response)
            document.documentElement.innerHTML = response;
        })
        .catch(error => {
            document.documentElement.innerHTML = response;
        });

}
