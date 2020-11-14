import React from 'react';

import {
  FiLock,
  FiUnlock,
} from 'react-icons/fi';

import FAB from '../FloatingActionButton';

const LockButton = ({
  locked,
  onToggle,
  location,
  size='1.5em'
}) => (
  <FAB offset="1em" tooltip={locked ? 'Unlock Diagram' : 'Lock Diagram'} onClick={onToggle} location={location}>
    {locked ? <FiLock size={size} /> : <FiUnlock size={size} />}
  </FAB>
);

export default LockButton;
