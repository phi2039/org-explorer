const Store = require('electron-store');

const store = new Store({
  configName: 'user-preferences',
  defaults: {
    lastFile: 'public/org.yaml',
  },
});

module.exports = {
  getLastFile: () => store.get('lastFile'),
  setLastFile: location => store.set('lastFile', location),
};
