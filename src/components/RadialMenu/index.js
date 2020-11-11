import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
`;


const togglerSize = 40;
const togglerColor = 'white';
const togglerTransition = 'transform .5s, top .5s';
const itemCount = 6;
const itemSize = togglerSize * 2;
const itemColor = 'white';
const itemTransition = '.5s';

const absoluteCenter = () => `
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
`;

const MenuItemne = () => `
  width: ${togglerSize};
  height: ${togglerSize / 8};
  display: block;
  z-index: 1;
  border-radius: ${togglerSize / 16};
  background: rgba(${togglerColor}, 0.7);
  transition: ${togglerTransition};
`;

const MenuToggler = styled.input`
  ${absoluteCenter}
  width: ${togglerSize};
  height: ${togglerSize};
  z-index: 2;
  opacity: 0;
  cursor: pointer;

  &:hover + label,
  &:hover + label:before,
  &:hover + label:after {
    background: ${togglerColor};
  }

  &:checked {
    & + label {
      background: transparent;
    }

    & + label:before,
    & + label:after {
      top: 0;
      width: ${togglerSize};
      transform-origin: 50% 50%;
    }

    & + label:before {
      transform: rotate(45deg);
    }

    & + label:after {
      transform: rotate(-45deg);
    }
  }

  &:checked ~ ul {
    .menu-item {
      opacity: 1;
    }

    /* @for $i from 0 through $item-count - 1 {
      .menu-item:nth-child(#{$i + 1}) {
        transform: rotate(360deg / $item-count * $i) translateX(-$item-size - 30px);
      }
    } */

    .menu-item a {
      pointer-events: auto;
    }
  }

  & + label {
    ${MenuItemne}
    ${absoluteCenter}

    &:before,
    &:after {
      ${MenuItemne}
      content: "";
      position: absolute;
      left: 0;
    }

    &:before {
      top: ${togglerSize / 4};
    }

    &:after {
      top: ${-togglerSize / 4};
    }
  }
`;

// @for $i from 0 through $item-count - 1 {
//   .menu-item:nth-child(#{$i + 1}) a {
//     transform: rotate(-360deg / $item-count * $i);
//   }
// }

const MenuItem = styled.li`
  ${absoluteCenter}
  width: ${itemSize};
  height: ${itemSize};

  display: block;
  opacity: 0;
  transition: ${itemTransition};

  & a {
    display: block;
    width: inherit;
    height: inherit;
    line-height: ${itemSize};
    color: rgba(${itemColor}, 0.7);
    background: rgba(white, 0.2);
    border-radius: 50%;
    text-align: center;
    text-decoration: none;
    font-size: ${itemSize / 2};
    pointer-events: none;
    transition: .2s;

    &:hover {
      box-shadow: 0 0 0 ${itemSize / 40} rgba(white, 0.3);
      color: ${itemColor};
      background: rgba(white, 0.3);
      font-size: ${itemSize} / 1.8;
    }
  }
`;


const RadialMenu = ({ children }) => {
  const [checked, setChecked] = useState(false);

  return (
    <nav>
      <MenuToggler checked={checked} onClick={() => setChecked(!checked)} id="menu-toggler" type="checkbox" />
      <label htmlFor="menu-toggler" />
      <ul>
        <MenuItem>
          <a className="fa fa-facebook" href="https://www.facebook.com/" target="_blank" />
        </MenuItem>
        <MenuItem>
          <a className="fa fa-google" href="https://www.google.com/" target="_blank" />
        </MenuItem>
        <MenuItem>
          <a className="fa fa-dribbble" href="https://dribbble.com/" target="_blank" />
        </MenuItem>
        <MenuItem>
          <a className="fa fa-codepen" href="https://codepen.io/" target="_blank" />
        </MenuItem>
        <MenuItem>
          <a className="fa fa-MenuItemnkedin" href="https://www.MenuItemnkedin.com/" target="_blank" />
        </MenuItem>
        <MenuItem>
          <a className="fa fa-github" href="https://github.com/" target="_blank" />
        </MenuItem>
      </ul>
    </nav>
    // {children}
  );
};

export default RadialMenu;
