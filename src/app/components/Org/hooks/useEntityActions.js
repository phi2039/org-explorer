import {
  useCallback,
} from 'react';

import {
  useActionDispatch,
  useActionState,
  beginActionAction,
  setClipboardAction,
  resetClipboardAction,
  useGraph,
} from '../state';

import { usePersistenceDispatch, mutateAction } from '../../../state/PersistenceContext';

// import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

const useEntityActions = entity => {
  const { clipboard } = useActionState();
  const actionDispatch = useActionDispatch();
  const persistenceDispatch = usePersistenceDispatch();
  const graph = useGraph();

  const mutate = useCallback(mutateAction(persistenceDispatch), [mutateAction]);

  const onEdit = useCallback(() => beginActionAction(actionDispatch)('edit', entity), [actionDispatch, entity]);

  const onCut = useCallback(() => entity && setClipboardAction(actionDispatch)(entity.id), [actionDispatch, entity]);

  const onPaste = useCallback(() => {
    if (entity && clipboard) {
      mutate({ update: [{ id: clipboard, values: { parent: entity.id } }] });
      resetClipboardAction(actionDispatch)();
    }
  }, [entity, clipboard, mutate, actionDispatch]);

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
    onPaste: clipboard ? onPaste : undefined,
    onCreateChild,
  };
};

export default useEntityActions;
