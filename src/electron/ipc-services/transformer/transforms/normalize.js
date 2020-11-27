const predicate = require('predicate');

const NormalizeTransform = () => {
  const denormalizeEntity = ({
    id,
    type,
    parent,
    name,
    annotations = [],
    measures = [],
  }) => ({
    id,
    type,
    parent,
    name,
    ...annotations.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    ...measures.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
  });

  const normalizeEntity = ({
    id,
    type,
    parent,
    name,
    tags,
    ...rest
  }) => ({
    id,
    type,
    parent,
    name,
    tags,
    annotations: Object.entries({ ...rest }).filter(([, value]) => typeof value === 'string'),
    measures: Object.entries({ ...rest }).filter(([, value]) => ['number', 'boolean'].includes(typeof value)),
  });

  const normalize = entries => entries.map(normalizeEntity);
  const denormalize = entries => entries.map(denormalizeEntity);

  return {
    normalize,
    denormalize,
  };
};

module.exports = NormalizeTransform;
