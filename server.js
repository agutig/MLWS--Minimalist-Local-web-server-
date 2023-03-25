
//Test:  http://localhost:9000/

//Modules
const utils = require('./utils.js');
const fs = require('fs');
const http = require('http');
const os = require('os');


//LOAD CONFIG
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));



// LOAD LOCAL IP
const IP =  "0.0.0.0"  // this specific direction only listen to ethernet dirs, not IP
const FRONT_PATH = "front/"
const PORT = 9000
const PASWORD = ""  //DONT FORGET TO ADD A PASSWORD
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

let {publicKey,privateKey} = utils.keyGenerator()
console.log(publicKey)

const server = http.createServer((req, res) => {

  let url = utils.print_req(req)

  if (req.method == "GET" ){

    if (url.pathname == '/'){ fs.readFile(FRONT_PATH + 'index.html', (err, data) => { if(!err){ OK(res,data) }else{NOT_OK(res)}});

    }else if (url.pathname == '/pk'){ OK(res, String(publicKey))

    }else{fs.readFile(FRONT_PATH + url.pathname.slice(1,), (err, data) => { if(!err){OK(res,data)}else{NOT_OK(res)}}); }

  }else if(req.method == "POST"){

    let body = '';
    req.on('data', function (data) {
      body += data;
    });
    req.on('end', function () {
      res.end(managePassword(body ,privateKey));
    });

  }


});

server.listen(PORT,IP);
//console.log(server)
console.log("SERVER CONECTED IN: http://" + String(IP) + "/" + String(PORT) )

/////////////////////////////////////////////////////

function managePassword(pswd ,privateKey){
  pswd = utils.toDecrypt(pswd, privateKey)
  if (String(pswd) == String(config.password)){
    return fs.readFileSync(FRONT_PATH + 'uploadDiv.html')
  }else{
    return ""
  }
}


