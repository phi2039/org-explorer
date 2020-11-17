import React from 'react';
import { PropTypes } from 'prop-types';

import { useField } from 'formik';

import Form from 'react-bootstrap/Form';

const TextInput = ({ label, placeholder = label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <Form.Group controlId={field.name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
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
