const fs = require('fs');

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
      const filePath = dirPath +"/"+ file;
      const stat = fs.statSync(filePath);
      size += stat.size;
      nFiles +=1
    });
  
    return (size/1000000),nFiles;
  }
  
  function manageStorage(file ,fileName, STORAGE_PATH, max_files ,max_size){
    let dirSize,nFiles = getDirectorySize(STORAGE_PATH)
    nFiles = nFiles
    dirSize = dirSize + (file.byteLength /1000000);
    
    if(nFiles ==0 && dirSize > max_size){
      return false
  
    }else if (nFiles > max_files || dirSize > max_size){
      oldest = getOldestFileInDirectory(STORAGE_PATH)
      deleteFile(oldest).then((result) => {
        manageStorage(file,fileName)
      })
      
  
    }else{
      fs.writeFile(STORAGE_PATH + "/" + fileName, file, (err) => {
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
  

function checkTipeFile(name ,permited){
  
    name = name.split(".")
    return permited.includes("." + String(name[name.length -1]))
  
}

function storageInfo(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (error, files) => {
      if (error) {
        reject(error);
      } else {
        const result = files.map((file) => {
          file = file.split(".")
          return {
            name: file[0],
            type: file[1]
          };
        });
        resolve(result);
      }
    });
  });
}

function numFiles(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (error, files) => {
      if (error) {
        reject(error);
      } else {
        resolve(files.length);
      }
    });
  });
}


function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }   
    })
  });
}


module.exports = {
    checkTipeFile,manageStorage,getDirectorySize,getOldestFileInDirectory ,deleteFile,storageInfo, readFile,numFiles
}
      
  