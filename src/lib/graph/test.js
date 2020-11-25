import Graph from '.';

const nodes = [
  {
    id: 'a',
    parent: null,
  },
  {
    id: 'b',
    parent: 'a',
  },
  {
    id: 'c',
    parent: 'a',
  },
  {
    id: 'd',
    parent: 'b',
  },
  {
    id: 'e',
    parent: 'd',
  },
];

const data = {
  a: 1,
  b: 1,
  c: 1,
  d: 1,
  e: 1,
};

const graph = Graph();

graph.add(nodes);
graph.depthFirstSearch(console.log, 'b');
graph.breadthFirstSearch(console.log, 'c'); //= $
graph.topologicalSort(null, 'b'); //= $
graph.topologicalSort(null, 'b').reduce((acc, item) => acc + data[item], 0); //= $
nodes.map(({ id }) => graph.topologicalSort(id).reduce((acc, item) => acc + data[item], 0)); //= $
