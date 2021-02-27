export interface ChatDocument {
  date: string;
  user: string;
  message: string;
}

export interface IndexDocument {
  id: string;
  index: string;
  op_type: "index" | "create";
  body: ChatDocument;
}

interface IndexOptionBulkIndex {
  index: {
    _index: IndexDocument["index"];
    _id: IndexDocument["id"];
  };
}

export interface BulkIndexDocument {
  refresh: boolean;
  body: Array<ChatDocument | IndexOptionBulkIndex>;
}

export interface SourceDocument {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  name: string;
  message: string;
}
