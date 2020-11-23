import React, {
  useCallback,
  useRef,
  cloneElement,
} from 'react';
import { PropTypes } from 'prop-types';

import Modal from '../common/Modal';
import FormSelector from './Forms/FormSelector';

const ModalForm = ({
  forms,
  formName,
  formMode,
  title,
  commitText,
  isShowing,
  onSubmit,
  onCancel,
  children,
  ...props
}) => {
  const formRef = useRef();

  const handleCommit = useCallback(() => {
    if (formRef.current && formRef.current.triggerSubmit) {
      const { triggerSubmit } = formRef.current;
      triggerSubmit && triggerSubmit();
    } else {
      console.log('no handler');
      onSubmit();
    }
  }, [onSubmit, formRef]);

  let content;
  if (!isShowing) {
    content = null;
  } else if (children) {
    const elements = React.Children.toArray(children);
    if (elements.length !== 1) {
      throw new Error('expected a single child element');
    }
    [content] = elements.map(element => cloneElement(element, {
      onSubmit,
      mode: formMode,
      ref: formRef,
      ...props,
    }));
  } else {
    content = (
      <FormSelector
        forms={forms}
        name={formName}
        mode={formMode}
        onSubmit={onSubmit}
        ref={formRef}
        {...props}
      />
    );
  }

  return (
    <Modal show={isShowing} onCancel={onCancel} onCommit={handleCommit} title={title} commitText={commitText}>
      {content}
    </Modal>
  );
};

ModalForm.propTypes = {
  forms: PropTypes.objectOf(PropTypes.elementType),
  formName: PropTypes.string,
  formMode: PropTypes.oneOf([
    'create',
    'edit',
    'delete',
    'none',
  ]),
  title: PropTypes.string,
  commitText: PropTypes.string,
  isShowing: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.string,
  ]),
};

ModalForm.defaultProps = {
  forms: null,
  formName: null,
  formMode: 'none',
  title: null,
  commitText: 'OK',
  isShowing: false,
  children: null,
};

export default ModalForm;
