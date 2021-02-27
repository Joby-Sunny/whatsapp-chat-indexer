export interface ProcessDocument {
  totalTook: number;
  aggregateError: boolean;
  totalIndexedDocuments: number;
  totalDatabaseRequests: number;
  totalFetchedDocuments: number;
}
