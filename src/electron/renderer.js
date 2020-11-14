import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ipcRenderer } from 'electron';

import App from '../app/components/App';

import { ViewProvider, useView } from '../app/state/ViewContext';
import { DataProvider, useDataContext } from '../app/state/DataContext';

import handleMenuAction from './menu-action-handler';

import '../../public/index.css';

// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render'); // eslint-disable-line global-require
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   });
// }

const DataHandler = () => {
  const { source: [, setSource], entities: { load } } = useDataContext();

  useEffect(() => {
    ipcRenderer.removeAllListeners('data-load');
    ipcRenderer.on('data-load', (event, { data, source }) => {
      setSource(source);
      load(data);
    });
    ipcRenderer.send('data-reload');
  }, [setSource, load]);
  return null;
};

const MenuHandler = () => {
  const [, setView] = useView();

  useEffect(() => {
    ipcRenderer.removeAllListeners('menu-action');
    ipcRenderer.on('menu-action', handleMenuAction({
      setView: view => setView && setView(view),
    }));
  }, [setView]);
  return null;
};

ReactDOM.render((
  <DataProvider initialEntities={{}} initialSource={null}>
    <DataHandler />
    <ViewProvider initialView="hierarchy">
      <MenuHandler />
      <App />
    </ViewProvider>
  </DataProvider>
), document.getElementById('root'));
