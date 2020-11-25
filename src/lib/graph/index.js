// credit: https://medium.com/better-programming/basic-interview-data-structures-in-javascript-graphs-3f9118aeb078
import { isArray } from 'lodash';

const Graph = (initialNodeOrNodes) => {
  const emptyState = () => ({
    adjacencyList: new Map(),
    inverseAdjacencyList: new Map(),
    root: null,
  });

  const state = emptyState();

  const addOne = ({ id, parent }) => {
    if (!id) {
      return;
    }
    if (!state.adjacencyList.get(id)) {
      state.adjacencyList.set(id, new Set([]));
    }
    if (parent) {
      state.inverseAdjacencyList.set(id, new Set([parent]));
      const adjacencies = state.adjacencyList.get(parent);
      if (adjacencies) {
        adjacencies.add(id);
      } else {
        state.adjacencyList.set(parent, new Set([id]));
      }
    } else {
      state.root = id;
      state.inverseAdjacencyList.delete(id);
    }
  };

  const addAll = nodes => {
    nodes.forEach(addOne);
  };

  const add = nodeOrNodes => {
    if (isArray(nodeOrNodes)) {
      addAll(nodeOrNodes);
    } else {
      addOne(nodeOrNodes);
    }
  };

  const root = () => state.root;

  const empty = () => !!state.adjacencyList.size;

  const size = () => state.adjacencyList.size;

  const path = node => {
    let current = node;
    const result = [];
    do {
      result.push(current);
      const adjacencies = state.inverseAdjacencyList.get(current);
      if (adjacencies) {
        [current] = adjacencies;
      } else {
        current = null;
      }
    } while (current);

    return result;
  };

  const adjacencies = node => {
    const nodes = state.adjacencyList.get(node);
    if (!nodes || !nodes.size) {
      return [];
    }
    return Array.from(nodes.values());
  };

  const depthFirstSearch = (fn, startNode) => {
    const start = startNode || state.root;
    if (!start) {
      throw new Error('no root found');
    }

    if (!state.adjacencyList.has(start)) {
      return [];
    }

    const visited = new Set();
    const dfs = node => {
      fn && fn(node);
      visited.add(node);
      const neighbors = state.adjacencyList.get(node);
      if (!neighbors) {
        console.error('aborting dfs', node);
        return;
      }
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }
    };

    dfs(start, fn);
    if (!visited.size) {
      return [];
    }
    return Array.from(visited.values());
  };

  const topologicalSort = (fn, startNode) => {
    const nodes = depthFirstSearch(null, startNode);
    nodes.reverse();
    if (fn) {
      nodes.forEach(fn);
    }
    return nodes;
  };

  const clear = () => {
    Object.assign(state, emptyState());
  };

  const breadthFirstSearch = (fn, startNode = state.root) => {
    const start = startNode || state.root;
    if (!start) {
      throw new Error('no root found');
    }

    if (!state.adjacencyList.has(start)) {
      return [];
    }

    const visited = new Set();
    const queue = [];
    queue.push(start);
    visited.add(start);

    while (queue.length > 0) {
      const currentNode = queue.shift();
      fn && fn(currentNode);

      const neighbors = state.adjacencyList.get(currentNode);
      if (!neighbors) {
        console.error('aborting bfs', currentNode);
        break;
      }
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
          visited.add(neighbor);
        }
      }
    }
    if (!visited.size) {
      return [];
    }
    return Array.from(visited.values());
  };

  if (initialNodeOrNodes) {
    console.log('initializing graph');
    add(initialNodeOrNodes);
  }

  return {
    add,
    clear,
    empty,
    size,
    root,
    path,
    adjacencies,
    depthFirstSearch,
    topologicalSort,
    breadthFirstSearch,
  };
};

export default Graph;
