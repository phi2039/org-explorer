const Store = require('electron-store');

const store = new Store({
  configName: 'user-preferences',
  defaults: {},
});

module.exports = {
  getLastFile: () => store.get('lastFile'),
  setLastFile: location => store.set('lastFile', location),
};
