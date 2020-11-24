const yaml = require('js-yaml');

const loadYamlData = async (buf) => {
  const data = yaml.load(buf);
  return data;
};

const storeYamlData = async (data) => {
  const buf = Buffer.from(yaml.dump(data));
  return buf;
};

module.exports = {
  load: loadYamlData,
  store: storeYamlData,
};
