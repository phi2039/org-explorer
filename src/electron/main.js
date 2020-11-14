const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  dialog,
} = require('electron'); // eslint-disable-line import/no-extraneous-dependencies

const isDev = require('electron-is-dev');
const userPrefs = require('./user-prefs');

const OrgDataService = require('../lib/data/service');

const dataService = OrgDataService();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

const loadDataFile = async (location) => {
  await dataService.loadFile(location);
  const data = dataService.getRoot();

  userPrefs.setLastFile(location);
  mainWindow.webContents.send('data-load', {
    data,
    source: location,
  });
  console.log(`Loaded ${location}`);
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
    await loadDataFile(location);
  }
};

const onSaveDataFile = async () => {
  const fileName = dialog.showSaveDialog({
    filters: [
      { name: 'Org Files', extensions: ['org'] },
    ],
  });
  if (fileName) {
    dataService.saveFile(fileName);
  }
};

const onWindowReady = async () => {
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

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
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
        {
          label: 'Pivot',
          click() {
            mainWindow.webContents.send('menu-action', 'view.pivot');
          },
        },
        {
          label: 'Test',
          click() {
            mainWindow.webContents.send('menu-action', 'view.test');
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

ipcMain.on('data-reload', () => {
  const location = userPrefs.getLastFile();
  console.log(`${location ? 'Loading' : 'Not loading'} most recent file${`: ${location}` || ''}`);
  loadDataFile(location);
});
