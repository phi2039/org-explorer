import React, {
  useCallback,
  useRef,
  cloneElement,
} from 'react';
import { PropTypes } from 'prop-types';

import styled from 'styled-components';

import { MoonLoader } from 'react-spinners';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.28);
  z-index: 100;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
`;

const FullPageSpinner = ({ caption, size = 125 }) => (
  <Container>
    <MoonLoader size={size} />
    {caption && <h2>{caption}</h2>}
  </Container>
);

export default FullPageSpinner;
