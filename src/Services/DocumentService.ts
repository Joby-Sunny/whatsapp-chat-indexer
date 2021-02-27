import makeHash from "md5";
import { Configuration } from "../Config/Configuration";
import { DocumentServiceConstants } from "../Config/DocumentServiceConstants";
import {
  BulkIndexDocument,
  ChatDocument,
  IndexDocument,
  SourceDocument,
} from "../Interfaces/Documents";

export class DocumentService {
  public makeIndexDocument(document: SourceDocument): IndexDocument {
    const timestamp = this.getTimestamp(document);
    const user = document.name.trim();
    const message = document.message;
    const body: IndexDocument["body"] = {
      date: timestamp.toISOString(),
      user,
      message,
    };
    const id = this.getDocumentID(body);
    const index = this.getIndexName(timestamp);
    return {
      id,
      index,
      op_type: DocumentServiceConstants.INDEX_OPERATION_TYPE,
      body,
    };
  }

  public makeBulkIndexDocument(
    documentList: Array<SourceDocument>
  ): BulkIndexDocument {
    const documentBody = documentList.flatMap((document: SourceDocument) => {
      const indexDocument = this.makeIndexDocument(document);
      return [
        { index: { _index: indexDocument.index, _id: indexDocument.id } },
        indexDocument.body,
      ];
    });
    return {
      refresh: DocumentServiceConstants.BULK_INDEX_REFRESH,
      body: documentBody,
    };
  }

  private getYear(year: string): number {
    let parsedYear = parseInt(year);
    if (parsedYear < DocumentServiceConstants.BASE_YEAR) {
      parsedYear += DocumentServiceConstants.BASE_YEAR;
    }
    return parsedYear;
  }

  private getMonth(month: string): number {
    let parsedMonth = parseInt(month);
    return parsedMonth - 1;
  }

  private getTimestamp(document: SourceDocument): Date {
    return new Date(
      this.getYear(document.year),
      this.getMonth(document.month),
      parseInt(document.day),
      parseInt(document.hour),
      parseInt(document.minute)
    );
  }

  private getIndexName(timestamp: Date): string {
    const year = timestamp.getFullYear();
    const month = DocumentServiceConstants.MONTHS[timestamp.getMonth()];
    return `${Configuration.INDEX_NAME_PREFIX}-${year}-${month}`;
  }

  private getDocumentID(documentBody: ChatDocument): string {
    const dataString = Object.keys(documentBody).reduce(
      (string: string, key: string) =>
        string ? `${string}-${documentBody[key]}` : documentBody[key],
      ""
    );
    return makeHash(dataString);
  }
}
