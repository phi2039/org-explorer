const readFile = async (url) => {
  return fetch(url);
};

module.exports = readFile;
