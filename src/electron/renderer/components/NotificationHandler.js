import React, { useEffect } from 'react';

import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

import { useToasts } from 'react-toast-notifications';

import Notification from '../../../app/components/common/Notification';

const NotificationHandler = () => {
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

export default NotificationHandler;
