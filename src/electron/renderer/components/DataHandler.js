import { useEffect } from 'react';

import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

import {
  usePersistence,
} from '../../../app/context/PersistenceContext';

import exportTransforms from '../exporters';

const normalizePath = str => str && str.replaceAll('\\', '/');

const DataHandler = () => {
  const { open, save } = usePersistence();

  useEffect(() => {
    const openListener = (event, { location, options }) => {
      open(location, options);
    };
    ipcRenderer.on('persistence:open', openListener);

    return () => {
      ipcRenderer.removeListener('persistence:open', openListener);
    };
  }, [open]);

  useEffect(() => {
    const flushListener = (event, location) => {
      save(location);
    };
    ipcRenderer.on('persistence:flush', flushListener);

    const exportListener = (event, location, format) => {
      save(location, {
        external: true,
        transforms: exportTransforms[format],
      });
    };
    ipcRenderer.on('persistence:export', exportListener);

    return () => {
      ipcRenderer.removeListener('persistence:flush', flushListener);
      ipcRenderer.removeListener('persistence:export', exportListener);
    };
  }, [save]);

  useEffect(() => {
    const dropListener = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const location = normalizePath(e.dataTransfer.files[0].path);
      open(location);
    };
    document.addEventListener('drop', dropListener);

    const dragListener = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener('dragover', dragListener);

    return () => {
      document.removeEventListener('drop', dropListener);
      document.removeEventListener('dragover', dragListener);
    };
  }, [open]);

  useEffect(() => {
    ipcRenderer.send('view:ready');
  }, []);

  return null;
};

export default DataHandler;
