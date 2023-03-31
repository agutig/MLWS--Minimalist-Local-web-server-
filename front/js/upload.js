//CODE TO UPLOAD
function uploadFile(){
    const fileInput = document.getElementById('fileUpload');
    const files = fileInput.files

    for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let fileName = file.name;
    console.log('uploading')

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function() {

    fileContents = reader.result;
    let arr = new Uint8Array(fileContents);
    blob = new Blob([arr]);

    fetch('/upload/files?name=' + file.name, {
        method: 'POST',
        body: blob,
        headers: {
        'Content-Type': 'application/octet-stream'
        }
    })
    }
    }
}
///



console.log("hey")
const fileInput = document.getElementById('fileUpload');
const fileText = document.getElementById('filesUploaded');
fileInput.addEventListener('change', function() {
    const fileList = fileInput.files;
    const fileNames = [];
    for (let i = 0; i < fileList.length; i++) {
        fileNames.push("<p id='fileName'> - "+fileList[i].name+"<p>");
    }
    fileText.innerHTML = fileNames.join('\n')

});
