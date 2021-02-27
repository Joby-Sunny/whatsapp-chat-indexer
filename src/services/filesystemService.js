const fileSystem = require("fs");

function getAllFilesInFolder(path) {
  return fileSystem.readdirSync(path);
}

module.exports.getAllFiles = getAllFilesInFolder;

function getFileData(path) {
  const dataBuffer = fileSystem.readFileSync(path);
  return JSON.parse(dataBuffer);
}

module.exports.getFileData = getFileData;
