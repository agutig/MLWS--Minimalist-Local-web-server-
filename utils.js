function print_req(req) {

    const myURL = new URL(req.url, 'http://' + req.headers['host']);
  
    if (true){
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



module.exports = {
    print_req,
  }