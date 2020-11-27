import { useEffect } from 'react';

import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

import { useView } from '../../../app/state/ViewContext';

const handleMenuAction = ({ setView }) => async (event, arg) => {
  if (arg === 'view.hierarchy') {
    setView('hierarchy');
  }
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

export default MenuHandler;
