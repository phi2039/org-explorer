export const flatten = (root, {
  childrenKey = 'children',
  basePath = '',
  nameKey = 'name',
  level = 1,
  lineage = [],
} = {}) => {
  const path = basePath ? `${basePath}/${root[nameKey]}` : root[nameKey];
  const node = {
    path,
    level,
    // lineage,
    ...root,
  };

  const newLineage = [
    ...lineage,
    node[nameKey],
  ];

  newLineage.forEach((l, index) => { node[`L${index + 1}`] = l; });

  const flat = [node];
  delete flat[0][childrenKey];

  if (root[childrenKey] && root[childrenKey].length > 0) {
    return flat.concat(root[childrenKey]
      .map((child) => flat(child, {
        childrenKey,
        basePath: node.path,
        nameKey,
        level: level + 1,
        lineage: newLineage,
      }))
      .reduce((a, b) => a.concat(b), []));
  }

  return flat;
};

// TODO: Implement alternative strategies
export const forEachNode = (root, callback, { childrenKey = 'children', strategy = 'pre' } = {}, context = { depth: 0 }) => { // pre, post, breadth
  callback(root, context);
  const children = root[childrenKey];
  if (children) {
    children.forEach(child => forEachNode(child, callback, { childrenKey, strategy }, { ...context, depth: context.depth + 1 }));
  }
};

export default {
  flatten,
  forEachNode,
};
