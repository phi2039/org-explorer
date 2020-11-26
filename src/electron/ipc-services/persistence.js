const EventEmitter = require('events');
const {
  ipcMain,
} = require('electron'); // eslint-disable-line import/no-extraneous-dependencies

const PersistenceService = ({ dataService }) => {
  const emitter = new EventEmitter();

  const loadData = async (location) => {
    const data = await dataService.loadFile(location);
    console.log('[PersistenceService] loaded', location);
    emitter.emit('load', location);
    return data;
  };

  const saveData = async (data, location, options = {}) => {
    if (location) {
      await dataService.saveFile(data, location);
      if (!options.temporary) {
        emitter.emit('save', location);
      }
      console.log('[PersistenceService] saved', location);
    }
  };

  ipcMain.handle('persistence:file:save', async (event, data, location, options) => {
    await saveData(data, location);
  });

  ipcMain.handle('persistence:file:load', async (event, location) => {
    const data = await loadData(location);
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
