const ObjectTransform = ({ key = 'id' } = {}) => ({
  values: obj => Object.values(obj),
  fromArray: arr => arr.reduce((acc, item) => ({ ...acc, [item[key]]: item }), {}),
});

module.exports = ObjectTransform;
