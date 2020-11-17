import React from 'react';
import { PropTypes } from 'prop-types';

import BSModal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Modal = ({
  show,
  title,
  commitText,
  cancelText,
  children,
  onCancel,
  onCommit,
}) => (
  <BSModal show={show} onHide={onCancel}>
    <BSModal.Header closeButton>
      <BSModal.Title>{title}</BSModal.Title>
    </BSModal.Header>
    <BSModal.Body>
      {children}
    </BSModal.Body>
    <BSModal.Footer>
      <Button variant="secondary" onClick={onCancel}>
        {cancelText || 'Cancel'}
      </Button>
      <Button variant="primary" onClick={onCommit}>
        {commitText || 'OK'}
      </Button>
    </BSModal.Footer>
  </BSModal>
);

export default Modal;
