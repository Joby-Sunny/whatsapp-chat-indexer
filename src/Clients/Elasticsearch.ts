import { Client } from "@elastic/elasticsearch";

export class Elasticsearch {
  private dbClient: Client;

  constructor(node: string, name: string) {
    this.dbClient = new Client({
      node: node,
      name: name,
    });
  }

  get client(): Client {
    return this.dbClient;
  }
}
