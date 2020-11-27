const path = require('path');
const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  dialog,
} = require('electron'); // eslint-disable-line import/no-extraneous-dependencies

require('./updates');

const isDev = require('electron-is-dev');
const userPrefs = require('./user-prefs');

const PersistenceService = require('./ipc-services/persistence');

const persistenceService = PersistenceService();

const isWindows = () => path.sep === '\\';
const normalizePath = str => str && (isWindows() ? str.replaceAll('\\', '/') : str);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

const fileTypeFilters = {
  all: { name: 'All File Types', extensions: ['org', 'xlsx', 'xlsb', 'xlsm', 'yaml', 'yml', 'json'] },
  org: { name: 'Org Files', extensions: ['org'] },
  excel: { name: 'Excel Files', extensions: ['xlsx', 'xlsb', 'xlsm'] },
  yaml: { name: 'YAML Files', extensions: ['yaml', 'yml'] },
  json: { name: 'JSON Files', extensions: ['json'] },
};

const sendNotification = ({
  level = 'info',
  title,
  message,
}) => {
  mainWindow.webContents.send('notification', {
    level,
    title,
    message,
  });
};

persistenceService.on('save', (location, options) => {
  if (!options) {
    userPrefs.setLastFile(location);
  }
  sendNotification({
    title: 'Saved',
    message: location,
  });
});

persistenceService.on('load', location => {
  userPrefs.setLastFile(location);
  sendNotification({
    title: 'Opened',
    message: location,
  });
});

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
      fileTypeFilters.all,
      fileTypeFilters.org,
      fileTypeFilters.excel,
      fileTypeFilters.json,
      fileTypeFilters.yaml,
    ],
    properties: ['openFile'],
  });
  if (!canceled && filePaths && filePaths.length) {
    const location = filePaths[0];
    openFile(location);
  }
};

const getSaveLocation = async ({ ignoreLastLocation, filters = [fileTypeFilters.org] }) => {
  const lastLocation = ignoreLastLocation ? undefined : userPrefs.getLastFile();
  if (lastLocation) {
    return lastLocation;
  }
  const result = await dialog.showSaveDialog({
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
};

const onSaveDataFileAs = async () => {
  const location = await getSaveLocation({ ignoreLastLocation: true });
  if (location) {
    saveFile(location);
  }
};

const onExport = async () => {
  const location = await getSaveLocation({
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
  const location = await getSaveLocation({ ignoreLastLocation: true });
  if (location) {
    openFile(location, { empty: true });
  }
};

const onWindowReady = async () => {
};

const loadLastFile = () => {
  const location = userPrefs.getLastFile();
  openFile(location);
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: '#bbbbbb',
    minWidth: 880,
    show: false, // Wait until everything is loaded to show
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // eslint-disable-line no-undef
    },
    height: 860,
    width: 1280,
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY); // eslint-disable-line no-undef

  mainWindow.webContents.once('did-finish-load', () => {
    onWindowReady();
  });

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require('electron-devtools-installer'); // eslint-disable-line global-require, import/no-extraneous-dependencies

    app.whenReady().then(() => {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => {
          console.log(`Added Extension: ${name}`);
        })
        .catch((err) => {
          console.log('An error occurred: ', err);
        });

      installExtension(REDUX_DEVTOOLS)
        .then((name) => {
          console.log(`Added Extension: ${name}`);
        })
        .catch((err) => {
          console.log('An error occurred: ', err);
        });
    });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    ipcMain.on('open-external-window', (event, arg) => {
      shell.openExternal(arg);
    });
  });
};

const generateMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          click() {
            onNewFile();
          },
          accelerator: 'CommandOrControl+N',
        },
        { type: 'separator' },
        {
          label: 'Open',
          click() {
            onLoadDataFile();
          },
          accelerator: 'CommandOrControl+O',
        },
        {
          label: 'Save',
          click() {
            onSaveDataFile();
          },
          accelerator: 'CommandOrControl+S',
        },
        {
          label: 'Save As...',
          click() {
            onSaveDataFileAs();
          },
          accelerator: 'CommandOrControl+Shift+S',
        },
        {
          label: 'Export...',
          click() {
            onExport();
          },
          accelerator: 'CommandOrControl+Shift+E',
        },
        { type: 'separator' },
        {
          role: 'quit',
          accelerator: 'CommandOrControl+Q',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Hierarchy',
          click() {
            mainWindow.webContents.send('menu-action', 'view.hierarchy');
          },
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

app.on('ready', () => {
  createWindow();
  generateMenu();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('load-page', (event, arg) => {
  mainWindow.loadURL(arg);
});

ipcMain.on('view:ready', () => {
  loadLastFile();
});
