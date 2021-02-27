const esClient = require("../clients/elasticsearch");

module.exports.indexDocument = async function (doc) {
  try {
    let response = await esClient.index(doc);
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports.bulkIndexDocument = async function (doc) {
  try {
    let response = await esClient.bulk(doc);
    return response;
  } catch (error) {
    throw error;
  }
};
