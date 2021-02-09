import React from 'react';

import { ToastProvider } from 'react-toast-notifications';

import App from '../../../app/components/App';

import { ViewProvider } from '../../../app/context/ViewContext';
import {
  PersistenceProvider,
} from '../../../app/context/PersistenceContext';

import DataHandler from './DataHandler';
import MenuHandler from './MenuHandler';
import NotificationHandler from './NotificationHandler';

import '../../../../public/index.css';
import { EntityProvider } from '../../../app/state/entity-store';
import PersistenceService from '../../../app/data/persistence';

const persistenceService = PersistenceService({
  persistenceAdapter: 'file',
});

const MainWindow = () => (
  <EntityProvider>
    <PersistenceProvider persistenceService={persistenceService}>
      <ToastProvider>
        <DataHandler />
        <NotificationHandler />
        <ViewProvider initialView="hierarchy">
          <MenuHandler />
          <App />
        </ViewProvider>
      </ToastProvider>
    </PersistenceProvider>
  </EntityProvider>
);

export default MainWindow;
