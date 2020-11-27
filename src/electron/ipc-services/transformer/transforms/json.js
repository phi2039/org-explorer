const JsonTransform = () => ({
  parse: buf => JSON.parse(buf),
  dump: obj => JSON.stringify(obj, null, 2),
});

module.exports = JsonTransform;
