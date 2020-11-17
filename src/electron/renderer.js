import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ipcRenderer } from 'electron';

import App from '../app/components/App';

import { ViewProvider, useView } from '../app/state/ViewContext';
import { DataProvider, useDataContext } from '../app/state/DataContext';
import { EntityProvider, useEntityState, useEntityDispatch } from '../app/state/EntityContext';

import handleMenuAction from './menu-action-handler';

import '../../public/index.css';

// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render'); // eslint-disable-line global-require
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   });
// }

const loadEntitiesAction = dispatch => data => {
  dispatch({
    type: 'load',
    payload: {
      data,
    },
  });
};

const DataHandler = () => {
  const { source: [, setSource], entities: { load } } = useDataContext();

  const entityDispatch = useEntityDispatch();

  const loadEntities = useCallback(loadEntitiesAction(entityDispatch), [entityDispatch]);

  useEffect(() => {
    ipcRenderer.removeAllListeners('data-load');
    ipcRenderer.on('data-load', (event, { data, source }) => {
      setSource(source);
      load(data);

      loadEntities(data);
    });
    ipcRenderer.send('data-reload');
  }, [setSource, load, loadEntities]);
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
  <EntityProvider>
    <DataProvider initialEntities={{}} initialSource={null}>
      <DataHandler />
      <ViewProvider initialView="hierarchy">
        <MenuHandler />
        <App />
      </ViewProvider>
    </DataProvider>
  </EntityProvider>
), document.getElementById('root'));
