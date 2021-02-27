import { Configuration } from "./Config/Configuration";
import { ProcessFileHandler } from "./Handlers/ProcessFileHandler";
import { FileSystemService } from "./Services/FileSystemService";
import { ProcessDocument } from "./Interfaces/Responses";

export class App {
  private processFileHandler: ProcessFileHandler;
  private fileSystemService: FileSystemService;

  constructor() {
    this.processFileHandler = new ProcessFileHandler();
    this.fileSystemService = new FileSystemService();
  }

  public async processFile(): Promise<void> {
    try {
      const fileList = this.fileSystemService.getAllFilesInFolder(
        Configuration.SOURCE_FOLDER
      );
      const total = { documentsFound: 0, documentsIndexed: 0 };
      for await (let file of fileList) {
        const {
          totalTook,
          aggregateError,
          totalIndexedDocuments,
          totalDatabaseRequests,
          totalFetchedDocuments,
        }: ProcessDocument = await this.processFileHandler.processDocument(
          file
        );
        console.log(
          `File: ${file} | `,
          `[requests : ${totalDatabaseRequests}] | `,
          `[took : ${totalTook}] | `,
          `[errors : ${aggregateError}] | `,
          `[total documents : ${totalFetchedDocuments}] | `,
          `[total indexed documents : ${totalIndexedDocuments}]`
        );
        total.documentsFound += totalFetchedDocuments;
        total.documentsIndexed += totalIndexedDocuments;
      }
      console.log(
        `Indexing Documents Completed\n`,
        `Total Documents : [found : ${total.documentsFound}] | [indexed : ${total.documentsIndexed}] `
      );
    } catch (error) {
      console.log("Error is ", error);
    }
  }
}

const app = new App();
app.processFile();
