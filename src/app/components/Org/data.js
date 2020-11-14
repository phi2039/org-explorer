// const treeEntities = {
//   foo: {
//     name: 'Foo',
//     parent: null,
//   },
//   bar: {
//     name: 'Bar',
//     parent: 'foo',
//   },
//   baz: {
//     name: 'Baz',
//     parent: 'foo',
//   },
//   eenie: {
//     name: 'Eenie',
//     group: 'bar',
//   },
//   meenie: {
//     name: 'Meenie',
//     group: 'bar',
//   },
//   miney: {
//     name: 'Miney',
//     group: 'baz',
//   },
// };

export const reduceData = (entities) => {
  const [root] = Object.entries(entities.groups).find(
    ([, { parent }]) => !parent,
  );

  const groups = Object.keys(entities.groups).map(entityId => ({
    id: entityId,
    entityId,
    type: 'group',
    children: [
      ...Object.entries(entities.groups)
        .filter(([, { parent: parentId }]) => parentId === entityId)
        .map(([childNodeId]) => childNodeId),
      ...Object.entries(entities.functions)
        .filter(([, { parent: parentId }]) => parentId === entityId)
        .map(([childNodeId]) => childNodeId),
    ],
  }));

  const functions = Object.keys(entities.functions).map(entityId => ({
    id: entityId,
    entityId,
    type: 'function',
  }));

  const nodes = [...groups, ...functions].reduce(
    (acc, { id, ...attrs }) => ({
      ...acc,
      [id]: {
        id,
        ...attrs,
      },
    }),
    {},
  );

  return {
    nodes,
    hierarchy: {
      root,
    },
  };
};

export const splitNodes = nodes => Object.entries(nodes).reduce((acc, [entityId, attrs]) => {
  if (attrs.group) {
    return {
      ...acc,
      functions: {
        ...acc.functions,
        [entityId]: attrs,
      },
    };
  }
  return {
    ...acc,
    groups: {
      ...acc.groups,
      [entityId]: attrs,
    },
  };
}, { functions: {}, groups: {} });
