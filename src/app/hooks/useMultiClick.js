import { useCallback, useEffect, useRef } from 'react';

const useMultiClick = (handlers, options = {}) => {
  const savedHandlers = useRef();
  const timeout = useRef();
  const count = useRef();

  useEffect(() => {
    const { onSingleClick, onDoubleClick } = handlers;
    savedHandlers.current = { onSingleClick, onDoubleClick };
  }, [handlers]);

  useEffect(() => () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, []);

  const handleClick = useCallback(e => {
    e.persist();
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    count.current += 1;
    const { onSingleClick, onDoubleClick } = savedHandlers.current;
    const { allEvents = false, delay = 250 } = options;
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    if (allEvents) {
      onSingleClick && onSingleClick(e);
    }

    timeout.current = setTimeout(() => {
      if (!allEvents && count.current === 1) {
        onSingleClick && onSingleClick(e);
      } else if (count.current === 2) {
        onDoubleClick && onDoubleClick(e);
      }
      count.current = 0;
    }, delay);
  }, [options]);

  return handleClick;
};

export default useMultiClick;
