/* eslint-disable arrow-body-style */
import {
  useCallback,
  useMemo,
} from 'react';

import { zipObject } from 'lodash';

// import { Timer } from '../../../../lib/util/timing';

import { createReducers, computeMeasures } from '../analytics';

// import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

const mapObject = (fn, ...args) => obj => Object.entries(obj).reduce((acc, [key, value]) => ({ ...acc, [key]: fn(value, ...args) }), {});

const mergeAdd = key => (acc, item) => (acc || 0) + (item[key] || 0);

const mergePartials = (reducers, sources, defaultValue = 0) => Object.keys(reducers)
  .reduce((acc, key) => ({ ...acc, [key]: sources.reduce(mergeAdd(key), defaultValue) }), defaultValue);

const applyNamedReducers = (accumulator, value, reducers) => Object.entries(reducers)
  .reduce((acc, [name, reduce]) => ({ ...acc, [name]: reduce(accumulator[name], value) }), {});

const objectLength = obj => Object.keys(obj).length;

const reducePartials = (graph, entities, reducers) => {
  if (!graph || !graph.size() || !entities || !objectLength(entities) || !objectLength(reducers)) {
    return {};
  }
  // const timer = Timer();
  const partials = new Map();

  const fn = id => {
    const adjacencies = graph.adjacencies(id);
    const acc = mergePartials(reducers, adjacencies.map(adjId => (partials.get(adjId) || {})));
    const node = entities[id];
    const partial = applyNamedReducers(acc, node, reducers);
    partials.set(id, partial);
  };

  graph.topologicalSort(fn);
  // console.log('partial time', timer.current());

  if (!partials.size) {
    return {};
  }

  return zipObject(Array.from(partials.keys()), Array.from(partials.values()));
};

const useGraphAnalytics = (graph, entities, {
  metrics,
  measures,
}) => {
  const partials = useMemo(() => reducePartials(graph, entities, createReducers(metrics)), [graph, entities, metrics]);

  // useWhyDidYouUpdate('useGraphAnalytics', { graph, entities, metrics });

  const enhance = useCallback(mapObject(computeMeasures(measures)), [measures]);

  const enhanced = useMemo(() => {
    const result = enhance(partials);
    // console.log('enhanced', result);
    return result;
  }, [partials, enhance]);

  return {
    partials,
    enhanced,
  };
};

export default useGraphAnalytics;
