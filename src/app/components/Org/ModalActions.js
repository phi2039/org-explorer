import React, {
  useCallback,
} from 'react';
import { PropTypes } from 'prop-types';

import { toTitleCase } from '../../../lib/util/strings';

import { useActionState, useActionDispatch } from './state';

import ModalForm from './ModalForm';

import FullPageSpinner from '../common/FullPageSpinner';

import { usePersistenceState } from '../../state/PersistenceContext';

const renderEntityActionForm = (entity, action, forms) => {
  const Form = forms[entity.type][action];
  return <Form entity={entity} />;
};

const ModalActions = ({
  forms,
  commitChanges,
}) => {
  const { action, subject } = useActionState();
  const { isSaving } = usePersistenceState();
  const actionDispatch = useActionDispatch();

  const closeModal = useCallback(() => actionDispatch({ type: 'cancel' }), [actionDispatch]);
  const isModalShowing = !!action;
  const onCommitChanges = useCallback(values => {
    commitChanges(action, subject, values);
    actionDispatch({ type: 'commit' });
  }, [commitChanges, action, subject, actionDispatch]);

  const formatTitle = (s, a) => `${toTitleCase(a)}${s ? ` ${toTitleCase(s.type)}` : ''}`;

  if (isSaving) {
    return (
      <FullPageSpinner caption="Saving" />
    );
  }

  return (
    <ModalForm formMode={action} isShowing={isModalShowing} onCancel={closeModal} onSubmit={onCommitChanges} title={formatTitle(subject, action)} commitText="Save">
      {isModalShowing && renderEntityActionForm(subject, action, forms)}
    </ModalForm>
  );
};

ModalActions.propTypes = {
  forms: PropTypes.shape({}).isRequired,
  commitChanges: PropTypes.func.isRequired,
};

export default ModalActions;
