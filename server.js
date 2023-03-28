
//Test:  http://localhost:9000/

//Modules
const utils = require('./utils.js');
const crypto = require('./serverCryptoUtils.js');
const fs = require('fs');
const http = require('http');
const os = require('os');
const storage = require('./storageUtils.js')

//LOAD CONFIG
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const FILES = JSON.parse(fs.readFileSync('front/files.json', 'utf8'));
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

    if (url.pathname == '/'){

      data = FILES.viewMenu
      
      data = manageEmpty(data.html ,data.css,data.js,(err, data) => {
      console.log(data)
      if(!err){
        console.log(data)
        OK(res,data) 
      }else{NOT_OK(res)}
    })

    }else if (url.pathname == '/upload.html'){ 
      data = FILES.lock
      data = manageEmpty(data.html ,data.css,data.js,(err, data) => {
      console.log(data)
      if(!err){
        console.log(data)
        OK(res,data) 
      }else{NOT_OK(res)}
    })

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
        access = managePassword(JSON.parse(body)[0] ,privateKey)
        if(access){
          let pswd_redir = "abcd"
          let url_redir = "/upload"
          let send = JSON.stringify([url_redir,pswd_redir])
          OK(res,send) 
        }
      });

    } else if (url.pathname == "/upload"){
      console.log(req.headers.authorization)
      if(req.headers.authorization == "abcd"){
        data = FILES.upload
        data = manageEmpty(data.html ,data.css,data.js,(err, data) => {
        console.log(data)
        if(!err){
          console.log(data)
          OK(res,data) 
        }else{NOT_OK(res)}
      })
      }

      
    } else if (url.pathname == "/upload/files"){
      let data = [];
      req.on('data', (chunk) => {
        data.push(chunk);
      }).on('end', () => {
      
      const fileName = STORAGE_PATH +"/"+ url.searchParams.get("name");
      if (storage.checkTipeFile(fileName)){
        data = Buffer.concat(data);
        storeResult = storage.manageStorage(data ,fileName)
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
    return true
  }else{
    return false
  }
}



function manageEmpty(html = "", css = [""], js = [""], callback) {
  let empty = fs.readFileSync(FRONT_PATH + '/empty.html', 'utf8');
  console.log("jamones al vapor")
  fs.readFile(FRONT_PATH + "/"+ html, 'utf8', (err, html) => {
    console.log(err)
    if (err) {
      callback(true);
    } else {
      
      empty = empty.replace("<!--ReplaceHTML-->", html);
      empty = empty.replace("<!--ReplaceCSS-->", css.join("\n"));
      empty = empty.replace("<!--ReplaceJS-->", js.join("\n"));
      callback(false, empty);
    }
  });
}