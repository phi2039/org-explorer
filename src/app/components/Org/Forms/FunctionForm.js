import React, { forwardRef, useCallback } from 'react';
import { PropTypes } from 'prop-types';

import * as Yup from 'yup';

import Form from './common/Form';

import TextInput from './common/TextInput';
import NumericInput from './common/NumericInput';
import Checkbox from './common/Checkbox';

const convertYesNoToBool = value => (value === 'Yes') || value === true;
const convertBoolToYesNo = value => value ? 'Yes' : 'No';

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
    payerFacing: convertYesNoToBool(entity.payerFacing),
    providerFacing: convertYesNoToBool(entity.providerFacing),
    requiresPHI: convertYesNoToBool(entity.requiresPHI),
  };

  const handleSubmit = useCallback(values => onSubmit({
    ...values,
    payerFacing: convertBoolToYesNo(values.payerFacing),
    providerFacing: convertBoolToYesNo(values.providerFacing),
    requiresPHI: convertBoolToYesNo(values.requiresPHI),
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
    payerFacing: PropTypes.string,
    providerFacing: PropTypes.string,
    requiresPHI: PropTypes.string,
  }),
};

FunctionForm.defaultProps = {
  mode: 'none',
  entity: {
    type: 'function',
    payerFacing: 'No',
    providerFacing: 'No',
    requiresPHI: 'No',
  },
  onSubmit: () => {},
};

export default FunctionForm;
