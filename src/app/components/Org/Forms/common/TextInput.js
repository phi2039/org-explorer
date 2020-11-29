import React, { useRef, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import { useField } from 'formik';

import Form from 'react-bootstrap/Form';

const TextInput = ({ label, placeholder = label, autoFocus, ...props }) => {
  const [field, meta] = useField(props);
  const ref = useRef();

  useEffect(() => {
    if (autoFocus && ref && ref.current && (typeof ref.current.focus === 'function')) {
      ref.current.focus();
    }
  }, [autoFocus, ref]);

  return (
    <Form.Group controlId={field.name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        ref={ref}
        placeholder={placeholder}
        isInvalid={meta.touched && meta.error}
        {...field}
        {...props}
      />
      <Form.Control.Feedback type="invalid">
        {meta.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInput;
