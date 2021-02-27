export class Configuration {
  public static readonly ELASTICSEARCH_CLIENT_NAME = "chat-indexer";
  public static readonly ELASTICSEARCH_NODE = "http://localhost:9200";
  public static readonly INDEX_NAME_PREFIX = "whatapp-chat";
  public static readonly SOURCE_FOLDER = "processed";
}
