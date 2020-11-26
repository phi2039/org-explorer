import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

import { ToastProvider, useToasts } from 'react-toast-notifications';

import App from '../app/components/App';
import Notification from '../app/components/common/Notification';

import { ViewProvider, useView } from '../app/state/ViewContext';
import {
  PersistenceProvider,
  usePersistenceDispatch,
  openAction,
  saveAction,
} from '../app/state/PersistenceContext';

import handleMenuAction from './menu-action-handler';

import '../../public/index.css';

const normalizePath = str => str && str.replaceAll('\\', '/');

const IpcHandler = () => {
  const { addToast } = useToasts();
  useEffect(() => {
    ipcRenderer.removeAllListeners('notification');
    ipcRenderer.on('notification', (event, {
      level,
      title,
      message,
      options = {},
    }) => {
      addToast(<Notification title={title} message={message} />, {
        appearance: level,
        autoDismiss: true,
        autoDismissTimeout: options.autoDismissTimeout || 1500,
      });
    });
  }, [addToast]);
  return null;
};

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

  useEffect(() => {
    const dropListener = document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const location = normalizePath(e.dataTransfer.files[0].path);
      openPersistence(location);
      console.log('File(s) you dragged here: ', location);
    });

    const dragListener = document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    return () => {
      document.removeEventListener('drop', dropListener);
      document.removeEventListener('dragover', dragListener);
    };
  }, [openPersistence]);

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
    <ToastProvider>
      <DataHandler />
      <IpcHandler />
      <ViewProvider initialView="hierarchy">
        <MenuHandler />
        <App />
      </ViewProvider>
    </ToastProvider>
  </PersistenceProvider>
), document.getElementById('root'));
