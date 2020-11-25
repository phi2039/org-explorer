import { useAnalytics } from '../analytics-context';

const useCalculatedValues = (entity) => {
  const { enhanced } = useAnalytics();

  if (!entity) {
    return null;
  }
  return enhanced[entity.id];
};

export default useCalculatedValues;
