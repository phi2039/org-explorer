// eslint-disable-next-line import/no-extraneous-dependencies
const { app, autoUpdater } = require('electron');
const isDev = require('electron-is-dev');

if (!isDev) {
  const server = 'https://hazel-gray-omega.vercel.app';
  const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

  autoUpdater.setFeedURL(feed);
}
