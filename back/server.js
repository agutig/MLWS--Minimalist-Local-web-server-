
//Test:  http://localhost:9000/

//Modules
const utils = require('./utils.js');
const crypto = require('./serverCryptoUtils.js');
const fs = require('fs');
const http = require('http');
const os = require('os');
const storage = require('./storageUtils.js');
const { send } = require('process');

//LOAD CONFIG
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const FILES = JSON.parse(fs.readFileSync('../front/files.json', 'utf8'));
const STORAGE_PATH = config.storage_path





// LOAD LOCAL IP
const IP =  "0.0.0.0"  // this specific direction only listen to ethernet dirs, not IP
const FRONT_PATH = "../front/"
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

    if (url.pathname == '/'){
      data = FILES.lock
      initEmpty(data.html ,data.css,data.js,(err, data) => {
      if(!err){
        data = data.replace("replaceURL","/viewMenu")
        OK(res,data) 
      }else{NOT_OK(res)}
    })

    }else if (url.pathname == '/upload'){ 
      data = FILES.lock
      data = initEmpty(data.html ,data.css,data.js,(err, data) => {
      if(!err){
        data = data.replace("replaceURL","/upload")
        OK(res,data) 
      }else{NOT_OK(res)}
    })

    }else if (url.pathname == '/pk'){ OK(res, String(publicKey))

    }else{fs.readFile(FRONT_PATH + url.pathname.slice(1,), (err, data) => { if(!err){OK(res,data)}else{NOT_OK(res)}}); }

  }else if(req.method == "POST"){

    if (url.pathname == "/access/upload"){
      let body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        clientPublicKey = JSON.parse(body)[1]
        access = managePassword(JSON.parse(body)[0] ,privateKey)
        if(access){
          let pswd_redir = "abcd"
          let url_redir = "/upload/unlocked"
          let send = JSON.stringify([url_redir,pswd_redir])
          OK(res,send) 
        }else{
          console.log("Incorrect password")
        }
      });

    }else if(url.pathname == "/access/viewMenu"){
      let body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        clientPublicKey = JSON.parse(body)[1]
        access = managePassword(JSON.parse(body)[0] ,privateKey)
        if(access){
          let pswd_redir = "abcd"
          let url_redir = "/viewMenu/unlocked"
          let send = JSON.stringify([url_redir,pswd_redir])
          OK(res,send) 
        }
      });


    } else if (url.pathname == "/upload/unlocked"){
      if(req.headers.authorization == "abcd"){
        data = FILES.upload
        storage.readFile(FRONT_PATH + "components/" + data.html).then((html) => {
          let send = JSON.stringify([html,data.css, data.js])
            OK(res,send) 
          }).catch((err) => {
            NOT_OK(res)
          });
      }

    } else if (url.pathname == "/viewMenu/unlocked"){
      if(req.headers.authorization == "abcd"){
        data = FILES.viewMenu
        storage.readFile(FRONT_PATH + "components/" + data.html).then((html) => {
          let send = JSON.stringify([html,data.css, data.js])
            OK(res,send) 
          }).catch((err) => {
            NOT_OK(res)
          });
         

      }

      
    } else if (url.pathname == "/upload/files"){
      let data = [];
      req.on('data', (chunk) => {
        data.push(chunk);
      }).on('end', () => {
      
      const fileName = url.searchParams.get("name");
      if (storage.checkTipeFile(fileName,config.permited_files)){
        data = Buffer.concat(data);
        console.log(FRONT_PATH + STORAGE_PATH)
        storeResult = storage.manageStorage(data ,fileName, (FRONT_PATH + STORAGE_PATH), config.max_files,config.max_size)
        if(storeResult){OK(res,"200 OK")}else{NOT_OK(res)}
      }else{
        NOT_OK(res)}
    });
    }else if(url.pathname == "/viewMenu/viewJson"){
      Promise.all([storage.readFile(FRONT_PATH +"components/elementPreview.html"),storage.storageInfo(FRONT_PATH + "/" + STORAGE_PATH)])
      .then(results => {
        OK(res,JSON.stringify(results)) 
      })
      
  }

  

  }


});

server.listen(PORT,IP);

console.log("SERVER CONECTED IN: http://" + String(IP) + "/" + String(PORT) )

/////////////////////////////////////////////////////

function managePassword(pswd ,privateKey){
  pswd = crypto.toDecrypt(pswd, privateKey)
  if (String(pswd) == String(config.password)){
    return true
  }else{
    return false
  }
}



function initEmpty(html = "", css = [""], js = [""], callback) {
  Promise.all([
    storage.readFile(FRONT_PATH + '/components/empty.html'),
    storage.readFile(FRONT_PATH + '/components/' + html),
    prepareCss(css),
    prepareJs(js)
  ])
    .then(values => {
      // Aquí se ejecuta cuando todas las promesas se han resuelto
      empty = values[0]
      empty = empty.replace("<!--ReplaceHTML-->", values[1]);
      empty = empty.replace("<!--ReplaceCSS-->", values[2]);
      empty = empty.replace("<!--ReplaceJS-->", values[3]);
      callback(false, empty);
  
      // Agrega aquí la lógica que deseas ejecutar cuando se han resuelto las promesas
    })
    .catch(error => {
      // Aquí se ejecuta si una de las promesas falla
      console.error(error);
    });
}

function prepareJs(jsArray){
  updatedArray = []
  jsArray.forEach((fileName) => {
    updatedArray.push( "<script type='text/javascript' src='" + fileName +"'></script>")
  })

  return updatedArray.join("\n")
}

function prepareCss(CssArray){
  updatedArray = []
  CssArray.forEach((fileName) => {
    updatedArray.push( "<link rel='stylesheet' href='" + fileName + "'>")
  })

  return updatedArray.join("\n")
}


