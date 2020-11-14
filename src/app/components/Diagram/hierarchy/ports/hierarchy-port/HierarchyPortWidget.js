import React from 'react';
import styled from 'styled-components';
import {
  color,
  layout,
  space,
  border,
} from 'styled-system';

import { PortWidget } from '@projectstorm/react-diagrams';

const ParentPort = styled.div`
  ${color}
  ${layout}
  ${space}
  ${border}
  cursor: ${({ locked }) => locked ? 'inherit' : 'pointer'};

  &:hover {
    ${({ locked }) => locked
    ? ''
    : 'background: mediumpurple;'}
  }
`;

ParentPort.defaultProps = {
  width: '12px',
  height: '12px',
  backgroundColor: 'darkgray',
  borderRadius: '4px',
  margin: '2px',
};

const ChildPort = styled.div`
  ${color}
  ${layout}
  ${space}
  ${border}
  cursor: ${({ locked }) => locked ? 'inherit' : 'pointer'};

  &:hover {
    ${({ locked }) => locked
    ? ''
    : 'background: mediumpurple;'}
  }
`;

ChildPort.defaultProps = {
  width: '12px',
  height: '12px',
  backgroundColor: 'darkgray',
  borderRadius: '4px',
  margin: '2px',
};

const ParentPortWidget = ({ engine, port, locked }) => (
  <PortWidget engine={engine} port={port}>
    <ParentPort locked={locked} />
  </PortWidget>
);

const ChildPortWidget = ({ engine, port, locked }) => (
  <PortWidget engine={engine} port={port}>
    <ChildPort locked={locked} />
  </PortWidget>
);

// TODO: Handle re-render on lock state change
export const HierarchyPortWidget = ({ engine, port }) => {
  const Widget = port.getOptions().isIn ? ChildPortWidget : ParentPortWidget;
  return <Widget engine={engine} port={port} locked={port.isLocked()} />;
};

export default HierarchyPortWidget;
