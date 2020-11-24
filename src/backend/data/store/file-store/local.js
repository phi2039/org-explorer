const fs = require('fs');

const readFile = async (file) => {
  const data = await fs.readFileSync(file);
  return data;
};

const writeFile = async (file, data) => {
  await fs.writeFileSync(file, data);
};

module.exports = {
  readFile,
  writeFile,
};
