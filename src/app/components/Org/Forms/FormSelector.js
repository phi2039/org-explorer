import React, { forwardRef } from 'react';
import { PropTypes } from 'prop-types';

const getComponent = ({
  name,
  forms,
  component,
}) => {
  // TODO: print warning?
  if (component) {
    return component;
  }

  if (!forms) {
    throw new Error('missing form definitions');
  }

  if (!name) {
    throw new Error('missing form name');
  }
  const form = forms[name];

  if (!form) {
    throw new Error('invalid form name');
  }

  return form;
};

// TODO: Is there a cleaner way to bubble up the 'submit' action?
const FormSelector = forwardRef(({
  name,
  mode,
  onSubmit,
  forms,
  component,
  ...props
}, ref) => {
  const Component = getComponent({
    name,
    forms,
    component,
  });

  return <Component ref={ref} mode={mode} onSubmit={onSubmit} {...props} />;
});

FormSelector.propTypes = {
  name: PropTypes.string,
  mode: PropTypes.oneOf([
    'create',
    'edit',
    'delete',
    'none',
  ]),
  onSubmit: PropTypes.func.isRequired,
  forms: PropTypes.objectOf(PropTypes.elementType),
  component: PropTypes.elementType,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.string,
  ]),
};

FormSelector.defaultProps = {
  name: null,
  mode: 'none',
  children: null,
  forms: null,
  component: null,
};

export default FormSelector;
