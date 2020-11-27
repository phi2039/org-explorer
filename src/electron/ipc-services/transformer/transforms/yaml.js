const yaml = require('js-yaml');

const YamlTransform = () => ({
  parse: buf => yaml.load(buf),
  dump: obj => yaml.dump(obj),
});

module.exports = YamlTransform;
