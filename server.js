
//Test:  http://localhost:9000/

//Modules
const utils = require('./utils.js');
const crypto = require('./serverCryptoUtils.js');
const fs = require('fs');
const http = require('http');
const os = require('os');
const { dir } = require('console');


//LOAD CONFIG
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const STORAGE_PATH = config.storage_path




// LOAD LOCAL IP
const IP =  "0.0.0.0"  // this specific direction only listen to ethernet dirs, not IP
const FRONT_PATH = "front/"
const PORT = 9000
const PASWORD = ""  //DONT FORGET TO ADD A PASSWORD
let clientPublicKey = ""
/////////////////////////////////////////////////////  BASIC STATIC HTML 

function OK(res,data){

    res.statusCode = 200;
    res.statusMessage = "OK"
    res.write(data);
    res.end();
    console.log("    200 OK")

}

function NOT_OK(res){
  res.statusCode = 404;
  res.statusMessage = "Not Found"
  res.setHeader('Content-Type','text/html');
  fs.readFile('error.html', (err, data) => { if(!err){
    res.write(data)
    res.end();
    console.log("    Error 404 NOT FOUND")
  }});
  
}

let {publicKey,privateKey} = crypto.keyGenerator()

const server = http.createServer((req, res) => {

  let url = utils.print_req(req)

  if (req.method == "GET" ){

    if (url.pathname == '/'){ fs.readFile(FRONT_PATH + 'index.html', (err, data) => { if(!err){ OK(res,data) }else{NOT_OK(res)}});

    }else if (url.pathname == '/pk'){ OK(res, String(publicKey))

    }else{fs.readFile(FRONT_PATH + url.pathname.slice(1,), (err, data) => { if(!err){OK(res,data)}else{NOT_OK(res)}}); }

  }else if(req.method == "POST"){

    if (url.pathname == "/access"){
      let body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        clientPublicKey = JSON.parse(body)[1]
        res.end(managePassword(JSON.parse(body)[0] ,privateKey));
      });

    } else if (url.pathname == "/upload.html"){
      let data = [];
      req.on('data', (chunk) => {
        data.push(chunk);
      }).on('end', () => {
      
      const fileName = STORAGE_PATH +"/"+ url.searchParams.get("name");
      if (checkTipeFile(fileName)){
        data = Buffer.concat(data);
        storeResult = manageStorage(data ,fileName)
        if(storeResult){OK(res,"200 OK")}else{NOT_OK(res)}
      }else{
        NOT_OK(res)
      }

    });
    }

  }


});

server.listen(PORT,IP);
//console.log(server)
console.log("SERVER CONECTED IN: http://" + String(IP) + "/" + String(PORT) )

/////////////////////////////////////////////////////

function managePassword(pswd ,privateKey){
  pswd = crypto.toDecrypt(pswd, privateKey)
  if (String(pswd) == String(config.password)){
    let html = (fs.readFileSync(FRONT_PATH + 'uploadDiv.html')).toString()
    html = html.replace("*/replaceTypes" , config.permited_files.join(", "))
    return html
  }else{
    return ""
  }
}

function checkTipeFile(name){
  
  permited = config.permited_files
  name = name.split(".")
  return permited.includes("." + String(name[name.length -1]))

}

function manageStorage(file ,fileName){
  let dirSize,nFiles = getDirectorySize(STORAGE_PATH)
  nFiles = nFiles
  dirSize = dirSize + (file.byteLength /1000000);
  
  if(nFiles ==0 && dirSize > config.max_size){
    return false

  }else if (nFiles > config.max_files || dirSize > config.max_size){
    oldest = getOldestFileInDirectory(STORAGE_PATH)
    deleteFile(oldest).then((result) => {
      manageStorage(file,fileName)
    })
    

  }else{
    fs.writeFile(fileName, file, (err) => {
      if (err) {
        console.error(err);
        return false
      } else {
        console.log("NEW FILE UPLOADED")
        return true
      }
    });
  }
}


function getDirectorySize(dirPath) {
  let size = 0;
  let nFiles = 0;
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = STORAGE_PATH +"/"+ file;
    const stat = fs.statSync(filePath);
    size += stat.size;
    nFiles +=1
  });

  return (size/1000000),nFiles;
}

function getOldestFileInDirectory(dirPath) {
  let oldestFile = null;
  let oldestFileCreationTime = null;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = STORAGE_PATH +"/"+ file;
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      if (!oldestFile || stat.birthtime < oldestFileCreationTime) {
        oldestFile = filePath;
        oldestFileCreationTime = stat.birthtime;
      }
    }
  });

  return oldestFile;
}

function deleteFile(filePath){
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('OLD FILE DELETED');
        resolve(true);
      }
    });
  });
}