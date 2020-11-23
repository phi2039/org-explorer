import {
  useState,
  useEffect,
} from 'react';

import { usePersistenceState } from '../../../state/PersistenceContext';

const useEntity = (id) => {
  const { cache: { entities } } = usePersistenceState();
  const [entity, setEntity] = useState(entities[id]);

  useEffect(() => {
    if (id) {
      setEntity(entities[id]);
    }
  }, [id, entities]);

  return entity;
};

export default useEntity;
