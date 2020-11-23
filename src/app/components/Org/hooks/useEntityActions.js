import {
  useCallback,
  useMemo,
} from 'react';

import { useActionDispatch, useActionState } from '../state';

import {
  beginActionAction,
  setClipboardAction,
  resetClipboardAction,
} from '../actions';

import { usePersistenceDispatch, mutateAction } from '../../../state/PersistenceContext';

const Entity = entity => {
  const { clipboard } = useActionState();
  const actionDispatch = useActionDispatch();
  const persistenceDispatch = usePersistenceDispatch();

  const mutate = useCallback(mutateAction(persistenceDispatch), [mutateAction]);

  const onEdit = useCallback(() => beginActionAction(actionDispatch)('edit', entity), [actionDispatch, entity]);
  const onCut = useMemo(() => clipboard ? null : () => setClipboardAction(actionDispatch)(entity.id), [actionDispatch, entity, clipboard]);
  const onPaste = useMemo(() => clipboard ? resetClipboardAction(actionDispatch) : null, [actionDispatch, clipboard]);
  const onCreateChild = useCallback(type => beginActionAction(actionDispatch)(
    'create',
    { type, parent: entity.id, path: [entity.path, entity.id].filter(path => !!path).join('/') },
  ), [actionDispatch, entity]);

  const onDelete = useCallback(() => {
    mutate({ remove: [entity.id, ...(entity.descendants || [])] });
  }, [mutate, entity]);

  return {
    onEdit,
    onDelete,
    onCut,
    onPaste,
    onCreateChild,
  };
};

export default Entity;
