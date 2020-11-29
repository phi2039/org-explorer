import React, { forwardRef, useCallback } from 'react';
import { PropTypes } from 'prop-types';

import * as Yup from 'yup';

import Form from './common/Form';

import TextInput from './common/TextInput';
import NumericInput from './common/NumericInput';
import Checkbox from './common/Checkbox';

const validationSchema = Yup.object({
  name: Yup.string()
    .max(64, 'Must be 64 characters or less')
    .required('Required'),
  description: Yup.string()
    .max(256, 'Must be 256 characters or less'),
  capacity: Yup.number()
    .positive('Must be greater than 0'),
  payerFacing: Yup.boolean(),
  providerFacing: Yup.boolean(),
  requiresPHI: Yup.boolean(),
});

const FunctionForm = forwardRef(({
  entity,
  mode,
  onSubmit,
}, ref) => {
  if (entity.type !== 'function') {
    throw new Error('invalid entity');
  }

  const initialValues = {
    name: entity.name || '',
    description: entity.description || '',
    currentFTE: entity.currentFTE || 1,
    payerFacing: entity.payerFacing,
    providerFacing: entity.providerFacing,
    requiresPHI: entity.requiresPHI,
  };

  const handleSubmit = useCallback(values => onSubmit({
    ...values,
    payerFacing: values.payerFacing,
    providerFacing: values.providerFacing,
    requiresPHI: values.requiresPHI,
  }), [onSubmit]);

  return (
    <Form
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      mode={mode}
      ref={ref}
    >
      <TextInput
        label="Name"
        name="name"
        type="text"
        placeholder="Function Name"
        autoFocus
      />
      <TextInput
        label="Description"
        name="description"
        type="textarea"
        placeholder=""
      />
      <NumericInput
        label="Capacity"
        name="currentFTE"
        type="text"
        placeholder="Enter Capacity"
      />
      <Checkbox
        label="Payer Facing"
        name="payerFacing"
      />
      <Checkbox
        label="Provider Facing"
        name="providerFacing"
      />
      <Checkbox
        label="Requires PHI"
        name="requiresPHI"
      />
      <input type="submit" hidden />
    </Form>
  );
});

FunctionForm.propTypes = {
  mode: PropTypes.oneOf([
    'create',
    'edit',
    'delete',
    'none',
  ]),
  onSubmit: PropTypes.func,
  entity: PropTypes.shape({
    type: PropTypes.oneOf(['function']),
    name: PropTypes.string,
    description: PropTypes.string,
    currentFTE: PropTypes.number,
    payerFacing: PropTypes.bool,
    providerFacing: PropTypes.bool,
    requiresPHI: PropTypes.bool,
  }),
};

FunctionForm.defaultProps = {
  mode: 'none',
  entity: {
    type: 'function',
    payerFacing: false,
    providerFacing: false,
    requiresPHI: false,
  },
  onSubmit: () => {},
};

export default FunctionForm;
