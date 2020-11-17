import React from 'react';
import { PropTypes } from 'prop-types';

import { useField } from 'formik';

import Form from 'react-bootstrap/Form';

const Checkbox = ({ label, ...props }) => {
  const [field] = useField(props);

  return (
    <Form.Check
      type="checkbox"
      id={field.name}
      checked={field.value}
      label={label}
      {...field}
      {...props}
    />
  );
};

export default Checkbox;
