
//Test:  http://localhost:9000/

//Modules
const utils = require('./utils.js');
const fs = require('fs');
const http = require('http');
const os = require('os');

// LOAD LOCAL IP

const IP = "0.0.0.0"  // this specific direction only listen to ethernet dirs, not IP
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



const server = http.createServer((req, res) => {
    
  url = utils.print_req(req)

  if (req.method == "GET" ){

    if (url.pathname == '/'){ fs.readFile(FRONT_PATH + 'index.html', (err, data) => { if(!err){ OK(res,data) }else{NOT_OK(res)}});

    }else{fs.readFile(FRONT_PATH + url.pathname.slice(1,), (err, data) => { if(!err){OK(res,data)}else{NOT_OK(res)}}); }

  }

});

server.listen(PORT,IP);
console.log("SERVER CONECTED IN: " + String(IP) + "/" + String(PORT) )

/////////////////////////////////////////////////////  DINAMIC HTML 

function manageMain(data, DATABASE){
  
  return data
}

