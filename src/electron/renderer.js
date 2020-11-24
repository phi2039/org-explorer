import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

import App from '../app/components/App';

import { ViewProvider, useView } from '../app/state/ViewContext';
import { PersistenceProvider, usePersistenceDispatch } from '../app/state/PersistenceContext';

import handleMenuAction from './menu-action-handler';

import useWhyDidYouUpdate from '../app/hooks/useWhyDidYouUpdate';
import '../../public/index.css';

const loadDataThunk = entities => async (dispatch, getState, extraArg) => {
  const persistenceService = extraArg;
  await persistenceService.load(entities);

  dispatch({
    type: 'load',
    payload: {
      entities,
    },
  });
};

const saveDataThunk = () => async (dispatch, getState, extraArg) => {
  const persistenceService = extraArg;
  await persistenceService.flush();
};

const DataHandler = () => {
  const persistenceDispatch = usePersistenceDispatch();
  const loadEntities = useCallback(entities => persistenceDispatch(loadDataThunk(entities)), [persistenceDispatch]);
  const saveData = useCallback(() => persistenceDispatch(saveDataThunk()), [persistenceDispatch]);

  const setSource = useCallback(source => persistenceDispatch({
    type: 'set_source',
    payload: {
      source,
    },
  }), [persistenceDispatch]);

  useWhyDidYouUpdate('Main Renderer', { setSource, loadEntities });

  useEffect(() => {
    ipcRenderer.removeAllListeners('data-load');
    ipcRenderer.on('load-data', (event, { source, entities }) => {
      setSource(source);
      loadEntities(entities);
    });
    ipcRenderer.on('save-data', () => {
      saveData();
    });
    ipcRenderer.send('data-reload');
  }, [setSource, loadEntities, saveData]);
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
  <PersistenceProvider initialSource={null}>
    <DataHandler />
    <ViewProvider initialView="hierarchy">
      <MenuHandler />
      <App />
    </ViewProvider>
  </PersistenceProvider>
), document.getElementById('root'));
