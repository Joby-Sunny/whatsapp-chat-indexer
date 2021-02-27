import { Elasticsearch } from "../Clients/Elasticsearch";
import { Configuration } from "../Config/Configuration";
import { IndexDocument, BulkIndexDocument } from "../Interfaces/Documents";

export class DatabaseService {
  private database: Elasticsearch;

  constructor() {
    this.database = new Elasticsearch(
      Configuration.ELASTICSEARCH_NODE,
      Configuration.ELASTICSEARCH_CLIENT_NAME
    );
  }

  public async addDocument(document: IndexDocument): Promise<any | Error> {
    try {
      const response = await this.database.client.index(document);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async addDocumentBulk(
    document: BulkIndexDocument
  ): Promise<any | Error> {
    try {
      const response = await this.database.client.bulk(document);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
