import {
  useMemo,
} from 'react';

import { useHotkeys } from 'react-hotkeys-hook';

import { useEntities } from '../../../state/entity-store';
import { useHierarchyState } from '../../Hierarchy';
import useClipboard from './useClipboard';

import useEntityActions from './useEntityActions';

// import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

const nop = () => {};

const useSelectionHotkeys = () => {
  const { entities } = useEntities();
  const { hierarchy: { selection } } = useHierarchyState();
  const { subject, resetClipboard } = useClipboard();

  const entity = useMemo(() => entities && selection && entities[selection], [entities, selection]);

  const {
    onEdit,
    onDelete,
    onCut,
    onPaste,
    onCreateChild,
  } = useEntityActions(entity);

  // useWhyDidYouUpdate('useSelectionHotkeys', { entities, entity, selection });

  useHotkeys('ctrl+g', () => onCreateChild('group'), [onCreateChild]);
  useHotkeys('ctrl+w', () => onCreateChild('function'), [onCreateChild]);
  useHotkeys('ctrl+x', onCut || nop, [onCut]);
  useHotkeys('ctrl+v', onPaste || nop, [onPaste]);
  useHotkeys('delete', onDelete, [onDelete]);
  useHotkeys('enter', onEdit, [onEdit]);
  useHotkeys('escape', subject ? resetClipboard : nop, [resetClipboard, subject]);
};

export default useSelectionHotkeys;
