const reducers = {
  sum: key => (acc, entity) => acc + (entity[key] || 0),
  // eslint-disable-next-line no-nested-ternary
  sumWhere: (fn, fnOrKey) => (acc, entity) => acc + (fn(entity) ? (typeof fnOrKey === 'function' ? fnOrKey(entity) : entity[fnOrKey]) : 0),
  count: () => acc => acc + 1,
  countWhere: fn => (acc, entity) => acc + (fn(entity) ? 1 : 0),
};

// eslint-disable-next-line import/prefer-default-export
export const aggregate = (metrics, entities) => metrics.reduce((metricAcc, metric) => {
  const reducer = reducers[metric.aggregation];
  const value = entities.reduce(reducer(...(metric.params || [])), 0);
  return {
    ...metricAcc,
    [metric.name]: value,
  };
}, {});

export const compute = (measures, entity) => measures.reduce((acc, measure) => {
  const fnOrValue = measure.value;
  const value = typeof fnOrValue === 'function' ? fnOrValue(entity) : fnOrValue;
  return {
    ...acc,
    [measure.name]: value,
  };
}, {});

export const isEqual = (key, value) => e => e[key] === value;
