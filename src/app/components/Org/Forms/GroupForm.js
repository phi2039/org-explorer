import React, { forwardRef, useCallback } from 'react';
import { PropTypes } from 'prop-types';

import * as Yup from 'yup';

import Form from './common/Form';

import TextInput from './common/TextInput';
import NumericInput from './common/NumericInput';

const validationSchema = Yup.object({
  name: Yup.string()
    .max(64, 'Must be 64 characters or less')
    .required('Required'),
  manager: Yup.string()
    .max(64, 'Must be 64 characters or less'),
  managerFTE: Yup.number()
    .when('manager', {
      is: val => !val,
      then: Yup.number().equals([0], 'Must be zero or blank if manager is not specified'),
      otherwise: Yup.number()
        .positive('Must be greater than 0')
        .max(100, 'Must be less than or equalt to 100')
        .required('Required when manager is specified'),
    }),
});

const GroupForm = forwardRef(({
  entity,
  mode,
  onSubmit,
}, ref) => {
  if (entity.type !== 'group') {
    throw new Error('invalid entity');
  }

  const handleSubmit = useCallback(values => onSubmit({
    ...values,
    managerFTE: values.manager ? values.managerFTE / 100 : undefined,
  }), [onSubmit]);

  return (
    <Form
      initialValues={{
        name: entity.name || '',
        manager: entity.manager || '',
        managerFTE: (entity.managerFTE || 0) * 100,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      mode={mode}
      ref={ref}
    >
      <TextInput
        label="Name"
        name="name"
        type="text"
        placeholder="Group Name"
        autoFocus
      />
      <TextInput
        label="Manager"
        name="manager"
        type="text"
        placeholder="Manager Name"
      />
      <NumericInput
        label="Manager Allocation"
        name="managerFTE"
        type="text"
        placeholder="0-100"
        format="percentage"
      />
      <input type="submit" hidden />
    </Form>
  );
});

GroupForm.propTypes = {
  mode: PropTypes.oneOf([
    'create',
    'edit',
    'delete',
    'none',
  ]),
  onSubmit: PropTypes.func,
  entity: PropTypes.shape({
    type: PropTypes.oneOf(['group']),
    name: PropTypes.string,
    manager: PropTypes.string,
    managerFTE: PropTypes.number,
  }),
};

GroupForm.defaultProps = {
  mode: 'none',
  entity: {
    type: 'group',
  },
  onSubmit: () => {},
};

export default GroupForm;
