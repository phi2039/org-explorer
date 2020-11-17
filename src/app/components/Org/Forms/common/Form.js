import React, {
  forwardRef,
  useCallback,
  useRef,
  useImperativeHandle,
} from 'react';
import { PropTypes } from 'prop-types';

import {
  Formik,
  Form as FormikForm,
} from 'formik';

// TODO: Is there a cleaner way to bubble up the 'submit' action?
const Form = forwardRef(({
  mode,
  onSubmit,
  initialValues,
  validationSchema,
  children,
}, ref) => {
  const formRef = useRef();

  const triggerSubmit = useCallback(() => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  }, []);

  useImperativeHandle(ref, () => ({
    triggerSubmit,
  }), [triggerSubmit]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      innerRef={formRef}
    >
      <FormikForm>
        {children}
      </FormikForm>
    </Formik>
  );
});

Form.propTypes = {
  mode: PropTypes.oneOf([
    'create',
    'edit',
    'delete',
  ]),
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({}),
  validationSchema: PropTypes.shape({}),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.string,
  ]).isRequired,
};

Form.defaultProps = {
  mode: 'create',
  initialValues: {},
  validationSchema: null,
};

export default Form;
