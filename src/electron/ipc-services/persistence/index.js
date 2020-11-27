const EventEmitter = require('events');

const {
  ipcMain,
} = require('electron'); // eslint-disable-line import/no-extraneous-dependencies

const Transformer = require('../transformer');
const LocalFileProvider = require('./local-file');

const baseOutputTransforms = [{
  transform: 'object',
  operation: 'values',
}, {
  transform: 'normalize',
  operation: 'normalize',
}];

const baseInputTransforms = [
  {
    transform: 'normalize',
    operation: 'denormalize',
  },
  {
    transform: 'object',
    operation: 'fromArray',
    config: {
      key: 'id',
    },
  },
];

const orgFileOutputTransforms = [
  {
    transform: 'yaml',
    operation: 'dump',
  },
];

const orgFileInputTransforms = [
  {
    transform: 'yaml',
    operation: 'parse',
  },
];

// TODO: Parse location to determine store provider and select standard transforms (e.g. JSON/YAML)
const PersistenceService = ({
  provider = 'local-file',
} = {}) => {
  const emitter = new EventEmitter();

  const persistenceProvider = LocalFileProvider();

  const transform = async (transforms, data) => {
    const transformer = Transformer({ transforms });
    return transformer.apply(data);
  };

  const loadData = async (location, {
    transforms = orgFileInputTransforms,
  } = {}) => {
    const data = await persistenceProvider.load(location);
    const transformedData = await transform([...transforms, ...baseInputTransforms], data);
    emitter.emit('load', location);
    console.log('[PersistenceService] loaded', location);
    return transformedData;
  };

  const saveData = async (data, location, {
    temporary,
    transforms = orgFileOutputTransforms,
  } = {}) => {
    if (location) {
      const transformedData = await transform([...baseOutputTransforms, ...transforms], data);
      await persistenceProvider.store(transformedData, location);
      if (!temporary) {
        emitter.emit('save', location, transforms && { transforms });
      }
      console.log('[PersistenceService] saved', location);
    }
  };

  ipcMain.handle('persistence:file:save', async (event, data, location, options) => {
    await saveData(data, location, options);
  });

  ipcMain.handle('persistence:file:load', async (event, location, options) => {
    const data = await loadData(location, options);
    return data;
  });

  return {
    loadData,
    saveData,
    once: emitter.once.bind(emitter),
    on: emitter.on.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter),
    removeAllListeners: emitter.removeAllListeners.bind(emitter),
  };
};

module.exports = PersistenceService;
