const yaml = require('js-yaml');

const loadYamlData = async (buf) => {
  const data = yaml.load(buf);
  return data;
};

module.exports = loadYamlData;
