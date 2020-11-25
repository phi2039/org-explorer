import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

import App from '../app/components/App';

import { ViewProvider, useView } from '../app/state/ViewContext';
import {
  PersistenceProvider,
  usePersistenceDispatch,
  openAction,
  saveAction,
} from '../app/state/PersistenceContext';

import handleMenuAction from './menu-action-handler';

import '../../public/index.css';

const DataHandler = () => {
  const persistenceDispatch = usePersistenceDispatch();
  const saveData = useCallback(saveAction(persistenceDispatch), [persistenceDispatch]);
  const openPersistence = useCallback(openAction(persistenceDispatch), [persistenceDispatch]);

  useEffect(() => {
    ipcRenderer.removeAllListeners('persistence:open');
    ipcRenderer.on('persistence:open', (event, { location, options }) => {
      openPersistence(location, options);
    });

    ipcRenderer.removeAllListeners('persistence:flush');
    ipcRenderer.on('persistence:flush', (event, location) => {
      saveData(location);
    });
    ipcRenderer.send('view:ready');
  }, [openPersistence, saveData]);
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
  <PersistenceProvider>
    <DataHandler />
    <ViewProvider initialView="hierarchy">
      <MenuHandler />
      <App />
    </ViewProvider>
  </PersistenceProvider>
), document.getElementById('root'));
