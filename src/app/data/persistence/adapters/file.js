import path from 'path-browserify';

import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

import MemoryPersistenceAdapter from './memory';

const FilePersistenceClient = () => {
  const loadData = async (location) => {
    if (location) {
      const data = await ipcRenderer.invoke('persistence:file:load', location);
      return data;
    }
    return null;
  };

  const saveData = async (data, location, options) => {
    if (location) {
      await ipcRenderer.invoke('persistence:file:save', data, location, options);
    }
  };

  return {
    loadData,
    saveData,
  };
};

const FilePersistenceAdapter = emitter => {
  const state = {
    filePath: null,
    backupInterval: 30000,
    backupJob: null,
    backupVersion: 0,
  };

  const fileProvider = FilePersistenceClient();

  const memoryProvider = MemoryPersistenceAdapter(emitter);

  // TODO: Move backup logic/timer to main process
  const saveBackup = async () => {
    if (state.filePath && state.backupVersion !== memoryProvider.getVersion()) {
      const parsedPath = path.parse(state.filePath);
      const backupFilePath = path.join(parsedPath.dir, `~${parsedPath.base}`);
      const data = await memoryProvider.getAll();
      await fileProvider.saveData(data, backupFilePath, { temporary: true });
      console.log('[FilePersistenceAdapter] backed-up changes:', backupFilePath);
    }
    state.backupVersion = memoryProvider.getVersion();
  };

  /* ***Adapter Implementation*** */
  const getLocation = () => state.filePath;

  const open = async (filePath, {
    backupInterval = 30000,
    empty,
  } = {}) => {
    if (!filePath) {
      throw new Error('filePath is required');
    }

    if (empty) {
      memoryProvider.open(filePath, { empty });
      console.log('[FilePersistenceAdapter] new:', filePath);
    } else {
      const documents = await fileProvider.loadData(filePath);
      memoryProvider.load(documents);
      console.log('[FilePersistenceAdapter] opened:', filePath);
    }
    state.filePath = filePath;
    state.backupVersion = memoryProvider.getVersion();

    if (state.backupJob) {
      clearInterval(state.backupJob);
    }
    state.backupJob = setInterval(saveBackup, backupInterval);

    emitter.emit('open', filePath, { backupInterval });
  };

  const flush = async (location, options = {}) => {
    if (!options.external && location && location !== state.filePath) {
      state.filePath = location;
      emitter.emit('location_changed', location);
    }

    const data = await memoryProvider.getAll();
    await fileProvider.saveData(data, location, options);

    state.backupVersion = memoryProvider.getVersion();
    console.log('[FilePersistenceAdapter] saved:', location);
  };

  const destroy = async () => {
    emitter.removeAllListeners();
    if (state.backupJob) {
      clearInterval(state.backupJob);
    }
    state.backupJob = null;
  };

  return {
    ...memoryProvider,
    getLocation,
    destroy,
    open,
    flush,
  };
};

export default FilePersistenceAdapter;
