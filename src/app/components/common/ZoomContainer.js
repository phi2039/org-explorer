import React, { useRef, useCallback, useState } from 'react';
import { PropTypes } from 'prop-types';

import useEventListener from '../../hooks/useEventListener';

const PINCH_ZOOM_FACTOR = 0.001;

export const useZoom = (initialZoom = 1.0, zoomIncrement = 0.1) => {
  const [zoom, setZoom] = useState(initialZoom);
  const zoomIn = () => setZoom(level => Math.min(2, level + zoomIncrement));
  const zoomOut = () => setZoom(level => Math.max(zoomIncrement, level - zoomIncrement));

  return {
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
  };
};

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
  setZoom: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

ZoomContainer.defaultProps = {
  setZoom: null,
};

export default ZoomContainer;
