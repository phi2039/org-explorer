const getCurrentTotalFTE = node => {
  if (node.type === 'function') {
    return node.currentFTE;
  }
  return (node.managerFTE || 0) + node.children.reduce((acc, child) => acc + getCurrentTotalFTE(child), 0);
};

const getCurrentTotalWorkloads = node => {
  if (node.type === 'function') {
    return 1;
  }
  return node.children.reduce((acc, child) => acc + getCurrentTotalWorkloads(child), 0);
};

const getCurrentTotalOverhead = node => {
  if (node.type === 'function') {
    return 0;
  }
  return (node.managerFTE || 0) + node.children.reduce((acc, child) => acc + getCurrentTotalOverhead(child), 0);
};

const getFilteredCurrentTotalFTE = (node, prop, value) => {
  const local = (node[prop] === value) ? node.currentFTE : 0;
  if (node.type === 'function') {
    return local;
  }
  return local + node.children.reduce((acc, child) => acc + getFilteredCurrentTotalFTE(child, prop, value), 0);
};

// TODO: Filter for functions and not groups
const countOccurrences = (node, prop, value) => {
  const local = (node[prop] === value) ? 1 : 0;
  if (node.type === 'function') {
    return local;
  }
  return local + node.children.reduce((acc, child) => acc + countOccurrences(child, prop, value), 0);
};

const calculateAggregates = node => ({
  ...node,
  children: node.children.map(calculateAggregates),
  currentTotalFTE: getCurrentTotalFTE(node),
  currentTotalWorkloads: getCurrentTotalWorkloads(node),
  currentTotalOverhead: getCurrentTotalOverhead(node),
  payerFacingInstances: countOccurrences(node, 'payerFacing', 'Yes'),
  providerFacingInstances: countOccurrences(node, 'providerFacing', 'Yes'),
  PHIInstances: countOccurrences(node, 'requiresPHI', 'Yes'),
  payerFacingFTE: getFilteredCurrentTotalFTE(node, 'payerFacing', 'Yes'),
  providerFacingFTE: getFilteredCurrentTotalFTE(node, 'providerFacing', 'Yes'),
  PHIFTE: getFilteredCurrentTotalFTE(node, 'requiresPHI', 'Yes'),
});

module.exports = {
  calculateAggregates,
};
