const Query = state => {
  const { nodes } = state;

  const getDescendants = nodeOrId => {
    const node = (typeof nodeOrId === 'string') ? nodes[nodeOrId] : nodeOrId;
    if (!node) {
      return [];
    }
    const prefix = [node.path, node.id].filter(path => !!path).join('/');
    const regexp = new RegExp(`^${prefix}.*$`);
    return Object.values(nodes).filter(n => n.path.match(regexp));
  };

  const getAncestors = node => {
    throw new Error('not implemented');
  };

  return {
    getDescendants,
    getAncestors,
  };
};

export default Query;
