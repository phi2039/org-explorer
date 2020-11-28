const path = require('path');
const {
  dialog,
} = require('electron'); // eslint-disable-line import/no-extraneous-dependencies

const userPrefs = require('./user-prefs');

const isWindows = () => path.sep === '\\';
const normalizePath = str => str && (isWindows() ? str.replaceAll('\\', '/') : str);

const FileHandlers = () => {
  let mainWindow;

  const setWindow = value => { mainWindow = value; };

  const fileTypeFilters = {
    all: { name: 'All File Types', extensions: ['org', 'xlsx', 'xlsb', 'xlsm', 'yaml', 'yml', 'json'] },
    org: { name: 'Org Files', extensions: ['org'] },
    excel: { name: 'Excel Files', extensions: ['xlsx', 'xlsb', 'xlsm'] },
    yaml: { name: 'YAML Files', extensions: ['yaml', 'yml'] },
    json: { name: 'JSON Files', extensions: ['json'] },
  };

  const openFile = (location, options) => {
    const normalizedLocation = normalizePath(location);
    if (normalizedLocation) {
      mainWindow.webContents.send('persistence:open', {
        location: normalizedLocation,
        options,
      });
    }
  };

  const saveFile = (location) => {
    const normalizedLocation = normalizePath(location);
    mainWindow.webContents.send('persistence:flush', normalizedLocation);
  };

  const exportFile = (location, format) => {
    const normalizedLocation = normalizePath(location);
    mainWindow.webContents.send('persistence:export', normalizedLocation, format);
  };

  const onLoadDataFile = async () => {
    const { filePaths, canceled } = await dialog.showOpenDialog({
      filters: [
        fileTypeFilters.org,
      ],
      properties: ['openFile'],
    });
    if (!canceled && filePaths && filePaths.length) {
      const location = filePaths[0];
      openFile(location);
      userPrefs.setLastFile(location);
    }
  };

  const getSaveLocation = async ({ ignoreLastLocation, filters = [fileTypeFilters.org], title }) => {
    const lastLocation = ignoreLastLocation ? undefined : userPrefs.getLastFile();
    if (lastLocation) {
      return lastLocation;
    }
    const result = await dialog.showSaveDialog({
      title,
      filters,
    });
    if (result.canceled) {
      return null;
    }

    return result.filePath;
  };

  const onSaveDataFile = async () => {
    const location = await getSaveLocation({ ignoreLastLocation: false });
    saveFile(location);
    userPrefs.setLastFile(location);
  };

  const onSaveDataFileAs = async () => {
    const location = await getSaveLocation({ ignoreLastLocation: true });
    if (location) {
      saveFile(location);
      userPrefs.setLastFile(location);
    }
  };

  const onExport = async () => {
    const location = await getSaveLocation({
      title: 'Export',
      ignoreLastLocation: true,
      filters: [
        fileTypeFilters.excel,
        fileTypeFilters.json,
        fileTypeFilters.yaml,
      ],
    });
    if (location) {
      const extension = path.extname(location).slice(1);
      const format = extension;
      exportFile(location, format);
    }
  };

  const onNewFile = async () => {
    const location = await getSaveLocation({
      title: 'New File',
      ignoreLastLocation: true,
    });
    if (location) {
      openFile(location, { empty: true });
    }
  };

  const loadLastFile = () => {
    const location = userPrefs.getLastFile();
    openFile(location);
  };

  return {
    setWindow,
    onLoadDataFile,
    onSaveDataFile,
    onSaveDataFileAs,
    onExport,
    onNewFile,
    loadLastFile,
  };
};

module.exports = FileHandlers;
