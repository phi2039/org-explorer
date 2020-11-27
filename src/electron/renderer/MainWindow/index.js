import React from 'react';

import { ToastProvider } from 'react-toast-notifications';

import App from '../../../app/components/App';

import { ViewProvider } from '../../../app/state/ViewContext';
import {
  PersistenceProvider,
} from '../../../app/state/PersistenceContext';

import DataHandler from '../components/DataHandler';
import MenuHandler from '../components/MenuHandler';
import NotificationHandler from '../components/NotificationHandler';

import '../../../../public/index.css';

const MainWindow = () => (
  <PersistenceProvider>
    <ToastProvider>
      <DataHandler />
      <NotificationHandler />
      <ViewProvider initialView="hierarchy">
        <MenuHandler />
        <App />
      </ViewProvider>
    </ToastProvider>
  </PersistenceProvider>
);

export default MainWindow;
