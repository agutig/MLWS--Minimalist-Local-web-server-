
//Test:  http://localhost:9000/

//Modules
const fs = require('fs');
const http = require('http');
const os = require('os');

// LOAD LOCAL IP
local_addresses = []
const networkInterfaces = os.networkInterfaces()["Ethernet"];

for (let i = 0 ; i < networkInterfaces.length ;i++) {
    if (!networkInterfaces[i].internal){local_addresses.push(networkInterfaces[i].address)}
}

console.log(local_addresses)

/////////////////////////////////////////////////////  BASIC STATIC HTML 
function print_info_req(req) {

  const myURL = new URL(req.url, 'http://' + req.headers['host']);

  if (false){
    console.log("");
    console.log("Mensaje de solicitud");
    console.log("====================");
    console.log("Método: " + req.method);
    console.log("Recurso: " + req.url);
    console.log("Version: " + req.httpVersion)
    console.log("Cabeceras: ");

    for (hname in req.headers)
      console.log(`  * ${hname}: ${req.headers[hname]}`);

    
    console.log("URL completa: " + myURL.href);
    console.log("  Ruta: " + myURL.pathname);
  }
  return myURL
}


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


const PUERTO = 9000;

const FRONT_PATH = "front/"

const server = http.createServer((req, res) => {
    
  url = print_info_req(req)

  if (req.method == "GET" ){

    if (url.pathname == '/'){ fs.readFile(FRONT_PATH + 'index.html', (err, data) => { if(!err){ OK(res,data) }else{NOT_OK(res)}});

    }else{fs.readFile(FRONT_PATH + url.pathname.slice(1,), (err, data) => { if(!err){OK(res,data)}else{NOT_OK(res)}}); }

  }

});

server.listen(PUERTO);


/////////////////////////////////////////////////////  DINAMIC HTML 

function manageMain(data, DATABASE){
  
  return data
}
