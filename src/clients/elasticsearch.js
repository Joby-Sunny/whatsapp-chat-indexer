const Elasticsearch = require("elasticsearch");
const config = require("../../config/configuration.json");

module.exports = new Elasticsearch.Client({
  host: config.ELASTICSEARCH_HOST,
  trace: config.LOG_LEVEL,
});
