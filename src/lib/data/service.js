const cuid = require('cuid');

const { readFile } = require('./store/file-store');

const ensureIds = (node, parent = null) => {
  const id = node.id || cuid();
  return {
    id,
    ...node,
    parent,
    children: (node.children || []).map(child => ensureIds(child, id)),
  };
};

const OrgDataService = () => {
  let root = null;

  const getRoot = () => {
    return root;
  };

  const loadFile = async (location, format) => {
    const data = await readFile(location, format);
    root = ensureIds(data[0] || data); // eslint-disable-line prefer-destructuring
  };

  const saveFile = async (location, format) => {

  };

  return {
    loadFile,
    saveFile,
    getRoot,
  };
};

module.exports = OrgDataService;
