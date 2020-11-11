const fs = require('fs');
// const { promisify } = require('util');

// const readFilePromise = promisify(fs.readFile);

const readFile = async (file) => {
  const data = await fs.readFileSync(file);
  // return readFilePromise(file);
  return data;
};

module.exports = readFile;
