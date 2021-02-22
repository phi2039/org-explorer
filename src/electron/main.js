const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
} = require('electron'); // eslint-disable-line import/no-extraneous-dependencies

require('./updates');
require('./debug');

const FileHandlers = require('./file-handlers');

const PersistenceService = require('./ipc-services/persistence');

const fileHandlers = FileHandlers();

const persistenceService = PersistenceService();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

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
  sendNotification({
    level: 'success',
    title: 'Saved',
    message: location,
  });
});

persistenceService.on('load', location => {
  sendNotification({
    level: 'success',
    title: 'Opened',
    message: location,
  });
});

const onWindowReady = async () => {
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: '#bbbbbb',
    minWidth: 880,
    show: false, // Wait until everything is loaded to show
    titleBarStyle: 'hidden',
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // eslint-disable-line no-undef
    },
    height: 860,
    width: 1280,
  });

  fileHandlers.setWindow(mainWindow);

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY); // eslint-disable-line no-undef

  mainWindow.webContents.once('did-finish-load', () => {
    onWindowReady();
  });

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
            fileHandlers.onNewFile();
          },
          accelerator: 'CommandOrControl+N',
        },
        { type: 'separator' },
        {
          label: 'Open',
          click() {
            fileHandlers.onLoadDataFile();
          },
          accelerator: 'CommandOrControl+O',
        },
        {
          label: 'Save',
          click() {
            fileHandlers.onSaveDataFile();
          },
          accelerator: 'CommandOrControl+S',
        },
        {
          label: 'Save As...',
          click() {
            fileHandlers.onSaveDataFileAs();
          },
          accelerator: 'CommandOrControl+Shift+S',
        },
        { type: 'separator' },
        {
          label: 'Export...',
          click() {
            fileHandlers.onExport();
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
        {
          label: 'Tree (Beta)',
          click() {
            mainWindow.webContents.send('menu-action', 'view.tree');
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
  fileHandlers.loadLastFile();
});
