const databaseService = require("../services/elasticsearchService");
const documentService = require("../services/documentService");
const fileService = require("../services/filesystemService");
const { waitFor, createFilePath } = require("../utilities/utilityfunctions");
const config = require("../../config/configuration.json");

const STACK_SIZE = 100;
const INDEXING_INTERVAL = 1500;

module.exports.processFileDocuments = async (fileName) => {
  try {
    let filePath = createFilePath(config.SOURCE_FOLDER, fileName);
    const fileData = fileService.getFileData(filePath);
    let responsedata = {
      took: 0,
      errors: false,
      totalItems: 0,
      requests: 0,
      totalDocuments: fileData.length,
    };
    let documentStack = [];

    for (let file of fileData) {
      documentStack.push(file);

      if (documentStack.length >= STACK_SIZE) {
        responsedata = await processCurrentStack(documentStack, responsedata);
        documentStack = [];
      }
    }

    if (documentStack.length) {
      responsedata = await processCurrentStack(documentStack, responsedata);
      documentStack = [];
    }

    return responsedata;
  } catch (error) {
    throw error;
  }
};

async function processCurrentStack(documentStack, responsedata) {
  try {
    let { took, errors, items } = await insertDocumentsInStackToDatabase(
      documentStack
    );
    responsedata.requests++;
    responsedata.took += took;
    responsedata.errors = responsedata.errors || errors;
    responsedata.totalItems += items;
    await waitFor(INDEXING_INTERVAL);
    return responsedata;
  } catch (error) {
    throw error;
  }
}

async function insertDocumentsInStackToDatabase(documentList) {
  try {
    const bulkIndexDocument = documentService.getBulkIndexDocument(
      documentList
    );
    const bulkIndexResponse = await databaseService.bulkIndexDocument(
      bulkIndexDocument
    );
    return {
      took: bulkIndexResponse.took,
      errors: bulkIndexResponse.errors,
      items: bulkIndexResponse.items.length,
    };
  } catch (error) {
    throw error;
  }
}
