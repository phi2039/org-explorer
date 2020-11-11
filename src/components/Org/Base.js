import React, { useState, useEffect, useCallback, createRef } from 'react';

import { Planet } from 'react-planet';

const PopupMenu = () => {
  return (
    <Planet
      centerContent={
        (
          <div
            style={{
              height: 100,
              width: 100,
              borderRadius: '50%',
              backgroundColor: '#1da8a4',
            }}
          />
        )
      }
      open
      autoClose
    >
      <div
        style={{
          height: 70,
          width: 70,
          borderRadius: '50%',
          backgroundColor: '#9257ad',
        }}
      />
      <div
        style={{
          height: 70,
          width: 70,
          borderRadius: '50%',
          backgroundColor: '#9257ad',
        }}
      />
    </Planet>
  );
}
const ContextMenu = ({ x, y }) => {
  const xPos = `${x}px`;
  const yPos = `${y}px`;
  return (
    <div
      style={{
        top: yPos,
        left: xPos,
        position: 'absolute',
        // background: 'yellow',
        // width: 200,
        // height: 250,
      }}
    >
      <PopupMenu />
    </div>
  );
};

const BaseNode = ({ children, ...props }) => {
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  const containerRef = createRef();

  const onContextMenu = useCallback(event => {
    event.preventDefault();
    setContextMenuPos({
      x: event.pageX,
      y: event.pageY,
    });
    setContextMenuVisible(true);
  }, [setContextMenuPos, setContextMenuVisible]);

  const onClick = useCallback(event => {
    if (contextMenuVisible) {
      setContextMenuVisible(false);
    }
  }, [contextMenuVisible, setContextMenuVisible]);

  useEffect(() => {
    if (containerRef.current) {
      const containerElement = containerRef.current;

      const contextMenuListener = containerElement.addEventListener('contextmenu', onContextMenu);
      const clickListener = document.addEventListener('click', onClick);

      return () => {
        containerElement.removeEventListener('contextmenu', contextMenuListener);
        document.removeEventListener('click', clickListener);
      };
    }
    return null;
  }, [containerRef, onContextMenu, onClick]);

  return (
    <div ref={containerRef} className="baseNode" {...props}>
      {children}
      {contextMenuVisible && <ContextMenu x={contextMenuPos.x} y={contextMenuPos.y} />}
    </div>
  );
};

export default BaseNode;
