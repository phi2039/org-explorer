const IdentityTransform = require('./identity');
const JsonTransform = require('./json');
const YamlTransform = require('./yaml');
const ExcelTransform = require('./excel');
const NormalizeTransform = require('./normalize');
const ObjectTransform = require('./object');

module.exports = {
  identity: IdentityTransform,
  json: JsonTransform,
  yaml: YamlTransform,
  excel: ExcelTransform,
  normalize: NormalizeTransform,
  object: ObjectTransform,
};
