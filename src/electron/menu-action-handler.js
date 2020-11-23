const handleMenuAction = ({ setView }) => async (event, arg) => {
  if (arg === 'view.hierarchy') {
    setView('hierarchy');
  }
};

export default handleMenuAction;
