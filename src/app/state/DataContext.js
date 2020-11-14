import { useState, useCallback } from 'react';
import constate from 'constate';
import produce from 'immer';
import { normalize, schema } from 'normalizr';

const nodeSchema = new schema.Entity('nodes');

const nodeArraySchema = new schema.Array({
  nodes: nodeSchema,
}, () => 'nodes');

nodeSchema.define({ children: nodeArraySchema });

export const normalizeOrg = data => {
  if (!data) {
    return {};
  }

  const normalizedData = normalize(data, nodeSchema);
  return {
    entities: normalizedData.entities,
    root: normalizedData.result,
  };
};

const useData = ({ initialSource, initialEntities = {}, initialRoot }) => {
  const [source, setSource] = useState(initialSource);
  const [entities, setEntities] = useState(initialEntities);
  const [root, setRoot] = useState(initialRoot);
  const [org, setOrg] = useState({}); // Temporary

  const load = useCallback(async (data) => {
    setOrg(data); // Temporary
    const normalizedData = normalizeOrg(data);
    setEntities(normalizedData.entities);
    setRoot(normalizedData.root);
  }, [setOrg, setEntities, setRoot]);

  const get = useCallback(id => entities.nodes[id], [entities]);

  const remove = useCallback(id => {
    const removeChildren = (node, draft) => {
      if (node.children) {
        node.children.forEach(child => {
          const { id: entityId } = child;
          removeChildren(child, draft);
          delete draft.nodes[entityId]; // eslint-disable-line no-param-reassign
        });
      }
    };

    setEntities(
      produce(draft => {
        const node = draft.nodes[id];
        removeChildren(node, draft);
        delete draft.nodes[id]; // eslint-disable-line no-param-reassign
      }),
    );
  }, [setEntities]);

  const getAll = useCallback(() => entities, [entities]);

  const getRoot = useCallback(() => root, [root]);

  const move = useCallback((id, newParentId) => {
    setEntities(
      produce(draft => {
        const node = draft.nodes[id];
        if (node) {
          const { parent: parentId } = node;
          if (parentId && parentId !== newParentId) {
            const parent = draft.nodes[parentId];
            const newParent = draft.nodes[newParentId];
            if (parent && newParent) {
              parent.children = parent.children.filter(child => child.id !== id);
              newParent.children = [
                ...(newParent.children || []),
                { id, schema: 'nodes' },
              ];
              node.parent = newParentId;
            }
          }
        }
      }),
    );
  }, [setEntities]);

  return {
    source: [source, setSource],
    entities: {
      load,
      get,
      getAll,
      getRoot,
      move,
      remove,
    },
    root,
    org, // Temporary
  };
};

export const [DataProvider, useDataContext, useSource, useEntities, useOrg] = constate(
  useData,
  context => context,
  ({ source }) => source,
  ({ entities }) => entities, // provider interface, not object
  ({ org }) => org, // Temporary
);
