module.exports.waitFor = (interval) =>
  new Promise((resolve) => setTimeout(resolve, interval));

module.exports.createFilePath = (pathPrefix, fileName) =>
  `./${pathPrefix}/${fileName}`;
