import React from 'react';

import styled from 'styled-components';

import useMultiClick from '../../../hooks/useMultiClick';

const BaseNodeContainer = styled.div`
  border-radius: 3px;
  margin: 0 5px 0 5px;
  display: inline-block;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);
  cursor: pointer;
  /* non-standard attribute */
  user-select: none;
`;

const BaseNode = ({ onClick, onDoubleClick, children, ...props }) => {
  const clickHandler = useMultiClick({ onSingleClick: onClick, onDoubleClick }, { allEvents: true });
  return (
    <BaseNodeContainer onClick={clickHandler} {...props}>
      {children}
    </BaseNodeContainer>
  );
};
export default BaseNode;
