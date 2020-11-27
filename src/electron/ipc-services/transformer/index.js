const pipeWith = require('ramda/src/pipeWith');

const Transforms = require('./transforms');

const pipeAsync = pipeWith(async (fn, res) => fn(await res));

/*
  operations: [
    transform: String,
    operation: String,
    config: Object
  ]
*/

const Transformer = ({
  transforms,
}) => {
  const operations = transforms.map(({ transform: transformName, operation: operationName, config }) => {
    const transformFactory = Transforms[transformName];
    if (!transformFactory) {
      throw new Error(`unknown transform: ${transformName}`);
    }

    const transform = transformFactory(config);
    const operation = transform[operationName];
    if (!operation) {
      throw new Error(`unknown operation ${transformName}.${operationName}`);
    }

    return operation;
  });

  console.log('[Transformer] create:', transforms.map(({ transform, operation }) => `${transform}.${operation}`).join(' -> '));

  const apply = pipeAsync(operations);

  return {
    apply,
  };
};

module.exports = Transformer;
