import { useState, useCallback } from 'react';

const useToggle = (initialState) => {
  const [state, setState] = useState(initialState);
  const toggleState = useCallback(() => setState(s => !s), [setState]);
  return [state, toggleState];
};

export default useToggle;
