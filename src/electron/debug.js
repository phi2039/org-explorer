const {
  app,
} = require('electron'); // eslint-disable-line import/no-extraneous-dependencies

const isDev = require('electron-is-dev');

if (isDev) {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
  } = require('electron-devtools-installer'); // eslint-disable-line global-require, import/no-extraneous-dependencies

  app.whenReady().then(() => {
    installExtension(REACT_DEVELOPER_TOOLS)
      .catch((err) => {
        console.log('An error occurred: ', err);
      });
  });
}
