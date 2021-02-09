import EventEmitter from 'eventemitter3';
import { defaults } from 'lodash';

import MemoryPersistenceAdapter from './adapters/memory';
import FilePersistenceAdapter from './adapters/file';

// TODO: Enforce immutability for returned objects
const PersistenceService = ({
  persistenceAdapter = 'memory',
  options,
} = {}) => {
  let providerFactory;
  if (persistenceAdapter === 'memory') {
    providerFactory = MemoryPersistenceAdapter;
  }

  if (persistenceAdapter === 'file') {
    providerFactory = FilePersistenceAdapter;
  }

  if (!providerFactory) {
    throw new Error('unknown adapter name');
  }

  const emitter = new EventEmitter();

  const provider = providerFactory(emitter, options);

  return defaults(provider, {
    getLocation: () => null,
    destroy: async () => {},
    flush: async () => {},
    getMany: async (ids) => {
      const results = await Promise.all(ids.map(provider.get.bind(provider)));
      return results;
    },
    createMany: async (items) => {
      const results = await Promise.all(items.map(provider.create.bind(provider)));
      return results;
    },
    updateMany: async (updates) => {
      const results = await Promise.all(updates.map(({ id, values }) => provider.update(id, values)));
      return results;
    },
    removeMany: async (ids) => {
      const results = await Promise.all(ids.map(provider.remove.bind(provider)));
      return results;
    },
  }, {
    once: emitter.once.bind(emitter),
    on: emitter.on.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter),
    removeAllListeners: emitter.removeAllListeners.bind(emitter),
  });
};

export default PersistenceService;
