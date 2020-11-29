import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const ControlBarContainer = styled.div`
  top: 0;
  right: 0;
  margin: 1rem;
  position: fixed;
  z-index: 30;
  padding-top: ${({ offsetTop }) => (typeof offsetTop === 'string') ? offsetTop : `${offsetTop || 0}px`};
  padding-left: 0;
`;

const ControlBarList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ControlBarListItem = styled.div`
  margin-bottom: 0.5rem;
  cursor: pointer;
  padding: 0.15rem;

  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ active }) => active ? `
  background-color: rgba(0,0,0,0.20);
  ` : `
  :hover {
    background-color: rgba(0,0,0,0.20);
  }
  `}
`;

const Control = ({ Icon, active, onClick }) => (
  <ControlBarListItem active={active} onClick={onClick}>
    <Icon size="1.5em" />
  </ControlBarListItem>
);

Control.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

Control.defaultProps = {
  active: false,
  onClick: null,
};

const ControlBar = ({ offsetTop, controls, initialActiveItem }) => {
  const [activeItem, setActiveItem] = useState(initialActiveItem);

  const items = useMemo(() => controls.map((control, i) => ({
    ...control,
    action: () => {
      setActiveItem(i);
      control.action && control.action();
    },
  })), [controls]);

  return (
    <ControlBarContainer offsetTop={offsetTop}>
      <ControlBarList>
        {items.map((item, i) => <Control key={item.name} Icon={item.icon} active={activeItem === i} onClick={item.action} />)}
      </ControlBarList>
    </ControlBarContainer>
  );
};

ControlBar.propTypes = {
  offsetTop: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  controls: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    icon: PropTypes.elementType,
    action: PropTypes.func,
  })),
  initialActiveItem: PropTypes.number,
};

ControlBar.defaultProps = {
  offsetTop: 0,
  controls: [],
  initialActiveItem: 0,
};

export default ControlBar;
