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

const OrgDataService = require('../backend/data/service');
const PersistenceService = require('./ipc-services/persistence');

PersistenceService({ dataService: OrgDataService() });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

const openFile = (location, options) => {
  if (location) {
    mainWindow.webContents.send('persistence:open', {
      location,
      options,
    });
  }
};

const saveFile = (location) => {
  mainWindow.webContents.send('persistence:flush', location);
};

const onLoadDataFile = async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog({
    filters: [
      { name: 'All File Types', extensions: ['org', 'xlsx', 'xlsb', 'xlsm', 'yaml', 'yml'] },
      { name: 'Org Files', extensions: ['org'] },
      { name: 'Excel Files', extensions: ['xlsx', 'xlsb', 'xlsm'] },
      { name: 'YAML Files', extensions: ['yaml', 'yml'] },
    ],
    properties: ['openFile'],
  });
  if (!canceled && filePaths && filePaths.length) {
    const location = filePaths[0];
    openFile(location);
  }
};

const getSaveLocation = async (ignoreLastLocation) => {
  const lastLocation = ignoreLastLocation ? undefined : userPrefs.getLastFile();
  if (lastLocation) {
    return lastLocation;
  }
  const result = await dialog.showSaveDialog({
    filters: [
      { name: 'Org Files', extensions: ['org'] },
    ],
  });
  if (result.canceled) {
    return null;
  }

  return result.filePath;
};

const onSaveDataFile = async () => {
  saveFile();
};

const onSaveDataFileAs = async () => {
  const location = await getSaveLocation(true);
  if (location) {
    saveFile(location);
  }
};

const onNewFile = async () => {
  const location = await getSaveLocation(true);
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
        },
        { type: 'separator' },
        {
          label: 'Open',
          click() {
            onLoadDataFile();
          },
        },
        {
          label: 'Save',
          click() {
            onSaveDataFile();
          },
        },
        {
          label: 'Save As...',
          click() {
            onSaveDataFileAs();
          },
        },
        { type: 'separator' },
        { role: 'quit' },
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
