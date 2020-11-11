const handleMenuAction = ({ setView }) => async (event, arg) => {
  if (arg === 'view.hierarchy') {
    setView('hierarchy');
  }

  if (arg === 'view.pivot') {
    setView('pivot');
  }

  if (arg === 'view.test') {
    setView('test');
  }
};

export default handleMenuAction;
