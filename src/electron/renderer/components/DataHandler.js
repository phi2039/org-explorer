import { useCallback, useEffect } from 'react';

import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

import {
  usePersistenceDispatch,
  openAction,
  saveAction,
} from '../../../app/state/PersistenceContext';

import exportTransforms from '../exporters';

const normalizePath = str => str && str.replaceAll('\\', '/');

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

    ipcRenderer.removeAllListeners('persistence:export');
    ipcRenderer.on('persistence:export', (event, location, format) => {
      saveData(location, {
        external: true,
        transforms: exportTransforms[format],
      });
    });
    ipcRenderer.send('view:ready');
  }, [openPersistence, saveData]);

  useEffect(() => {
    const dropListener = document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const location = normalizePath(e.dataTransfer.files[0].path);
      openPersistence(location);
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

export default DataHandler;
