import { useState } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = () => {
    setIsShowing(!isShowing);
  };

  const open = () => {
    setIsShowing(true);
  };

  const close = () => {
    setIsShowing(false);
  };

  return {
    isShowing,
    toggle,
    open,
    close,
  };
};

export default useModal;
