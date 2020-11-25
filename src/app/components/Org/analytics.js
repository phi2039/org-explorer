const reducers = {
  sum: key => (acc, obj) => acc + (obj[key] || 0),
  // eslint-disable-next-line no-nested-ternary
  sumWhere: (fn, fnOrKey) => (acc, obj) => acc + (fn(obj) ? (typeof fnOrKey === 'function' ? fnOrKey(obj) : obj[fnOrKey]) : 0),
  count: () => acc => acc + 1,
  countWhere: fn => (acc, obj) => acc + (fn(obj) ? 1 : 0),
};

export const reduceAggregates = metrics => {
  const aggregations = metrics.reduce((acc, metric) => ({ ...acc, [metric.name]: reducers[metric.aggregation](...(metric.params || [])) }), {});
  return (accumulators, obj) => Object.entries(aggregations).reduce((acc, [name, reducer]) => ({
    ...acc,
    [name]: reducer(accumulators[name] || 0, obj),
  }), {});
};

export const computeMeasures = measures => {
  const enhancers = measures.reduce((acc, { name, value: fnOrValue }) => ({ ...acc, [name]: typeof fnOrValue === 'function' ? fnOrValue : () => fnOrValue }), {});
  return obj => ({
    ...obj,
    ...Object.entries(enhancers).reduce((acc, [name, enhance]) => ({ ...acc, [name]: enhance(obj) }), {}),
  });
};

export const createReducers = metrics => metrics.reduce((acc, metric) => ({ ...acc, [metric.name]: reducers[metric.aggregation](...(metric.params || [])) }), {});

export const isEqual = (key, value) => e => e[key] === value;
