import { DatabaseService } from "../Services/DatabaseService";
import { Configuration } from "../Config/Configuration";
import { ProcessFileHandlerConstants } from "../Config/ProcessFileHandlerConstants";
import { waitFor, makeFilePath } from "../Utilities/UtilityFunctions";
import { DocumentService } from "../Services/DocumentService";
import { FileSystemService } from "../Services/FileSystemService";
import { ProcessDocument } from "../Interfaces/Responses";
import { SourceDocument, BulkIndexDocument } from "../Interfaces/Documents";
import { ApiResponse } from "@elastic/elasticsearch";

export class ProcessFileHandler {
  private documentService: DocumentService;
  private databaseService: DatabaseService;
  private fileSystemService: FileSystemService;

  constructor() {
    this.databaseService = new DatabaseService();
    this.documentService = new DocumentService();
    this.fileSystemService = new FileSystemService();
  }

  public async processDocument(fileName: string): Promise<ProcessDocument> {
    try {
      const filePath = makeFilePath(Configuration.SOURCE_FOLDER, fileName);
      const fileData = this.fileSystemService.getFileData(filePath);
      const response = await this.processDocumentAsStack(fileData);
      return response;
    } catch (error) {
      console.log(`Failed to process file: ${fileName}`);
      throw error;
    }
  }

  private async processDocumentAsStack(
    fileData: Array<SourceDocument>
  ): Promise<ProcessDocument> {
    try {
      let response: ProcessDocument = {
        totalTook: 0,
        aggregateError: false,
        totalIndexedDocuments: 0,
        totalDatabaseRequests: 0,
        totalFetchedDocuments: fileData.length,
      };
      let documentStack = [];

      for (let file of fileData) {
        documentStack.push(file);

        if (documentStack.length >= ProcessFileHandlerConstants.STACK_SIZE) {
          response = await this.processCurrentStack(documentStack, response);
          documentStack = [];
        }
      }

      if (documentStack.length) {
        response = await this.processCurrentStack(documentStack, response);
        documentStack = [];
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  private async processCurrentStack(
    documentStack: Array<SourceDocument>,
    responseData: ProcessDocument
  ): Promise<ProcessDocument> {
    try {
      const indexDocument = this.makeInsertDocument(documentStack);
      const { took, errors, items } = await this.insertToDatabase(
        indexDocument
      );
      responseData.totalDatabaseRequests++;
      responseData.totalTook += took;
      responseData.aggregateError = responseData.aggregateError || errors;
      responseData.totalIndexedDocuments += items;
      await waitFor(ProcessFileHandlerConstants.INDEXING_INTERVAL);
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  private makeInsertDocument(
    documentStack: Array<SourceDocument>
  ): BulkIndexDocument {
    return this.documentService.makeBulkIndexDocument(documentStack);
  }

  private async insertToDatabase(
    indexDocument: BulkIndexDocument
  ): Promise<any> {
    try {
      const response: ApiResponse = await this.databaseService.addDocumentBulk(
        indexDocument
      );
      ``;
      return {
        took: response.body.took,
        errors: response.body.errors,
        items: response.body.items.length,
      };
    } catch (error) {
      throw error;
    }
  }
}
