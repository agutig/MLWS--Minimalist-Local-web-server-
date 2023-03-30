//CODE TO UPLOAD
function uploadFile(){
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0]
    const fileName = file.name
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
///