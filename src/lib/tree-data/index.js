const TreeNode = (id, data) => {
  const children = [];
  let parent = null;
  let currentData = data;

  const getParent = () => parent;

  const addChild = child => children.push(child);

  const getData = () => currentData;

  const setData = value => {
    currentData = value;
  };

  return {
    addChild,
    getParent,
    getData,
    setData,
  };
};

const Tree = () => {

};
