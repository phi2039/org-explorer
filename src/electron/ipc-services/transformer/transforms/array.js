const ArrayTransform = ({ key = 'type' } = {}) => ({
  group: arr => arr.reduce((acc, item) => ({
    ...acc,
    [item[key]]: [...(acc[item[key]] || []), item],
  }), {}),
});

module.exports = ArrayTransform;
