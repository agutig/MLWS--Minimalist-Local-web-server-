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
  

function checkTipeFile(name){
  
    permited = config.permited_files
    name = name.split(".")
    return permited.includes("." + String(name[name.length -1]))
  
}

module.exports = {
    checkTipeFile,manageStorage,getDirectorySize,getOldestFileInDirectory ,deleteFile
}
      
  