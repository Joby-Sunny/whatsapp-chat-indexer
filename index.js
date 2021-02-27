const config = require("./config/configuration.json");
const {
  processFileDocuments,
} = require("./src/handlers/processFileDocumentsHandler");
const { getAllFiles } = require("./src/services/filesystemService");

async function init() {
  try {
    const fileList = getAllFiles(config.SOURCE_FOLDER);
    let total = { documentsFound: 0, documentsIndexed: 0 };
    for await (let file of fileList) {
      let response = await processFileDocuments(file);
      console.log(
        `File: ${file} |`,
        ` [requests : ${response.requests}] |`,
        ` [took : ${response.took}] |`,
        ` [errors : ${response.errors}] |`,
        ` [total documents : ${response.totalDocuments}] |`,
        ` [total processed : ${response.totalItems}]`
      );
      total.documentsFound += response.totalDocuments;
      total.documentsIndexed += response.totalItems;
    }
    console.log(
      `Indexing Documents Completed\n`,
      `Total Documents : [found : ${total.documentsFound}] } | [indexed : ${total.documentsIndexed}]`
    );
  } catch (error) {
    console.log("Error is", error);
  }
}

init();
