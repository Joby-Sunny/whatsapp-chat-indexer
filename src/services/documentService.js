const makeMD5Hash = require("md5");
const config = require("../../config/configuration.json");
const INDEX_OPERATION_TYPE = "index";

// For mapping month index to name
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Function to create ID for elasticsearch document
 */
function makeDocumentID(dataObject) {
  const dataString = Object.keys(dataObject).reduce(
    (string, key) =>
      string ? string + "-" + dataObject[key] : dataObject[key],
    ""
  );
  return makeMD5Hash(dataString);
}

/**
 * Function to create index name for elasticsearch document
 */
function makeIndexName(timestamp) {
  const year = timestamp.getFullYear();
  const month = MONTHS[timestamp.getMonth()].toLowerCase();
  return `${config.INDEX_NAME_PREFIX}-${year}-${month}`;
}

/**
 * Function to create a proper data-time object for indexing
 */
function makeTimestamp(docItem) {
  const getYear = () => {
    const parsedYear = parseInt(docItem.year);
    return parsedYear > 2000 ? parsedYear : 2000 + parsedYear;
  };
  const getMonth = () => parseInt(docItem.month) - 1;
  const getDay = () => parseInt(docItem.day);
  const getHours = () => parseInt(docItem.hour);
  const getMinutes = () => parseInt(docItem.minute);
  return new Date(getYear(), getMonth(), getDay(), getHours(), getMinutes());
}

/**
 * Function to create an elasticseach document for index operation
 */
function makeIndexDocument(docItem) {
  const timestamp = makeTimestamp(docItem);
  const user = docItem.name.trim();
  const message = docItem.message;
  const body = { date: timestamp.toISOString(), user, message };
  const index = makeIndexName(timestamp);
  const id = makeDocumentID(body);
  return {
    id,
    index,
    op_type: INDEX_OPERATION_TYPE,
    body,
  };
}

/**
 * Function to create an elasticsearch document for bulk-index opeartion
 */
function makeBulkIndexDocument(docList) {
  const documentBody = docList.flatMap((doc) => {
    const indexDocument = makeIndexDocument(doc);
    return [
      { index: { _index: indexDocument.index, _id: indexDocument.id } },
      indexDocument.body,
    ];
  });
  return { refresh: true, body: documentBody };
}

module.exports.getIndexDocument = makeIndexDocument;
module.exports.getBulkIndexDocument = makeBulkIndexDocument;
