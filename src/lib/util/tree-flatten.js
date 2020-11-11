const flattenTree = (root, { childrenKey = 'children', basePath = '', nameKey = 'name', level = 1, lineage = [] } = {}) => {
  const node = {
    path: basePath ? `${basePath}/${root[nameKey]}` : root[nameKey],
    level,
    // lineage,
    ...root,
  };

  const newLineage = [
    ...lineage,
    node[nameKey],
  ];

  newLineage.forEach((l, index) => node[`L${index + 1}`] = l)

  let flatten = [node];
  delete flatten[0][childrenKey];

  if (root[childrenKey] && root[childrenKey].length > 0) {
    return flatten.concat(root[childrenKey]
      .map((child)=>flattenTree(child, { childrenKey, basePath: node.path, nameKey, level: level + 1, lineage: newLineage }))
      .reduce((a, b)=>a.concat(b), [])
    );
  }

  return flatten;
};

export default flattenTree;
