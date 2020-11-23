import MemoryPersistenceAdapter from './persistence-adapters/memory';

// TODO: Enforce immutability for returned objects
const PersistenceService = ({
  persistenceAdapter = 'memory',
} = {}) => {
  console.log('initialize entity service');

  let providerFactory;
  if (persistenceAdapter === 'memory') {
    providerFactory = MemoryPersistenceAdapter;
  }

  if (!providerFactory) {
    throw new Error('unknown adapter name');
  }

  const provider = providerFactory();

  return provider;
};

export default PersistenceService;
