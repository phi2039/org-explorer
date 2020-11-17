import React, { useState, useEffect, useCallback } from 'react';
import { PropTypes } from 'prop-types';

import { useField } from 'formik';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'

const NumericInput = ({ label, format, placeholder = label, ...props }) => {
  const [field, meta] = useField(props);

  const inputProps = {
    pattern: '[0-9]|[1-9][0-9]+',
    title: 'Only numbers allowed',
    type: 'number',
  };

  if (format === 'percentage') {
    return (
      <Form.Group controlId={field.name}>
        <Form.Label>{label}</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={placeholder}
            isInvalid={meta.touched && meta.error}
            {...field}
            {...props}
            {...inputProps}
          />
          <InputGroup.Append>
            <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
          </InputGroup.Append>
          <Form.Control.Feedback type="invalid">
            {meta.error}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    );
  }

  return (
    <Form.Group controlId={field.name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        placeholder={placeholder}
        isInvalid={meta.touched && meta.error}
        {...field}
        {...props}
        {...inputProps}
      />
      <Form.Control.Feedback type="invalid">
        {meta.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default NumericInput;
