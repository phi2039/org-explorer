const {
  ipcMain,
} = require('electron'); // eslint-disable-line import/no-extraneous-dependencies

const PersistenceService = ({ dataService }) => {
  const loadData = async (location) => {
    const data = await dataService.loadFile(location);
    console.log('[PersistenceService] loaded', location);
    return data;
  };

  const saveData = async (data, location) => {
    if (location) {
      await dataService.saveFile(data, location);
      console.log('[PersistenceService] saved', location);
    }
  };

  ipcMain.handle('persistence:file:save', async (event, data, location) => {
    await saveData(data, location);
  });

  ipcMain.handle('persistence:file:load', async (event, location) => {
    const data = await loadData(location);
    return data;
  });

  return {
    loadData,
    saveData,
  };
};

module.exports = PersistenceService;
