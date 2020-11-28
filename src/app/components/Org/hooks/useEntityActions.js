import {
  useCallback,
} from 'react';

import { useToasts } from 'react-toast-notifications';

import {
  useActionDispatch,
  beginActionAction,
  useGraph,
} from '../state';

import useClipboard from './useClipboard';

import { usePersistenceDispatch, mutateAction } from '../../../state/PersistenceContext';

// import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

const useEntityActions = entity => {
  const { subject, setClipboard, resetClipboard } = useClipboard();
  const actionDispatch = useActionDispatch();
  const persistenceDispatch = usePersistenceDispatch();
  const graph = useGraph();
  const { addToast } = useToasts();

  const notify = useCallback((level, message) => {
    addToast(message, {
      appearance: level,
      autoDismiss: true,
      autoDismissTimeout: 1500,
    });
  }, [addToast]);

  const mutate = useCallback(mutateAction(persistenceDispatch), [mutateAction]);

  const onEdit = useCallback(() => beginActionAction(actionDispatch)('edit', entity), [actionDispatch, entity]);

  const onCut = useCallback(() => entity && setClipboard(entity.id), [entity, setClipboard]);

  const onPaste = useCallback(() => {
    if (entity && subject) {
      const descendants = graph.depthFirstSearch(null, subject);
      if (descendants.includes(entity.id)) {
        notify('error', 'Can\'t paste into descendant');
      } else {
        mutate({ update: [{ id: subject, values: { parent: entity.id } }] });
        resetClipboard();
      }
    }
  }, [entity, subject, mutate, resetClipboard, graph, notify]);

  const onCreateChild = useCallback(type => beginActionAction(actionDispatch)(
    'create',
    { type, parent: entity.id },
  ), [actionDispatch, entity]);

  const onDelete = useCallback(() => {
    if (entity) {
      const ids = graph.depthFirstSearch(null, entity.id);
      mutate({ remove: ids });
    }
  }, [mutate, entity, graph]);

  // useWhyDidYouUpdate('useEntityActions', { entity, clipboard });

  return {
    onEdit,
    onDelete,
    onCut,
    onPaste: subject ? onPaste : undefined,
    onCreateChild,
  };
};

export default useEntityActions;
