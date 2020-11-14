import React from 'react';

import styled from 'styled-components';

const BaseNodeContainer = styled.div`
  border-radius: 3px;
  margin: 0 5px 0 5px;
  display: inline-block;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);
`;

const BaseNode = ({ children, ...props }) => (
  <BaseNodeContainer {...props}>
    {children}
  </BaseNodeContainer>
);

export default BaseNode;
