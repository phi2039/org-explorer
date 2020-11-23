import {
  useState,
  useEffect,
  useMemo,
} from 'react';

import { usePersistenceState } from '../../../state/PersistenceContext';

import { aggregate, compute } from '../analytics';

// import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

const useCalculatedValues = (entity, {
  metrics,
  measures,
}) => {
  const { cache: { entities } } = usePersistenceState();
  const [descendants, setDescendants] = useState([]);

  // useWhyDidYouUpdate('useCalculatedValues', { entities, descendants });

  useEffect(() => {
    if (entity) {
      const d = Object.values(entities).filter(({ id }) => entity.descendants && entity.descendants.includes(id));
      setDescendants(d);
    } else {
      setDescendants([]);
    }
  }, [entity, entities]);

  const aggregates = useMemo(() => {
    if (!entity) {
      return {};
    }
    const result = aggregate(metrics, [entity, ...descendants]);
    // console.log('aggregates', result);
    return result;
  }, [descendants, entity, metrics]);

  const computed = useMemo(() => {
    if (!entity) {
      return {};
    }
    const result = compute(measures, { ...entity, ...aggregates });
    // console.log('computed', result);
    return result;
  }, [entity, aggregates, measures]);

  if (!entity) {
    return null;
  }

  return {
    ...aggregates,
    ...computed,
  };
};

export default useCalculatedValues;
