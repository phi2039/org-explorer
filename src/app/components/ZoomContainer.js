import React, { useRef, useCallback } from 'react';
import { PropTypes } from 'prop-types';

import useEventListener from '../hooks/event-listener';

const PINCH_ZOOM_FACTOR = 0.005;

const ZoomContainer = ({ zoom, setZoom, children }) => {
  const container = useRef(null);
  const onWheel = useCallback(e => {
    e.preventDefault();

    if (e.ctrlKey) {
      setZoom(zoom - (e.deltaY * PINCH_ZOOM_FACTOR));
    }
  }, [zoom, setZoom]);

  useEventListener('wheel', onWheel, container.current);

  const getTransform = z => `scale(${z})`;
  return (
    <div ref={container} style={{ minHeight: '100vh', minWidth: '100%' }}>
      <div style={{ transform: getTransform(zoom), transformOrigin: 'top center' }}>
        {children}
      </div>
    </div>
  );
};

ZoomContainer.propTypes = {
  zoom: PropTypes.number.isRequired,
};

export default ZoomContainer;
