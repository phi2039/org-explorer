import { createRxDatabase, addRxPlugin } from 'rxdb';

// import GroupSchema from './schemas/group.json';
// import FunctionSchema from './schemas/function.json';
import NodeSchema from './schemas/node.json';

addRxPlugin(require('pouchdb-adapter-indexeddb'));

const Database = async () => {
  const db = await createRxDatabase({
    name: 'orgdata',
    adapter: 'indexeddb',
    multiInstance: false,
    eventReduce: true,
  });

  // await db.collection({
  //   name: 'group',
  //   schema: GroupSchema
  // });

  // await db.collection({
  //   name: 'function',
  //   schema: FunctionSchema
  // });

  const nodesCollection = await db.collection({
    name: 'nodes',
    schema: NodeSchema,
  });

  const bulkLoad = async (nodes) => {
    try {
      const items = Object.values(nodes)
        .map(({
          children,
          getPath,
          path,
          ...node
        }) => ({
          ...node,
        }));
      const { success, error } = await nodesCollection.bulkInsert(items);

      console.dir(success);
      console.dir(error);
      // error.forEach(e => console.log(e));
    } catch (err) {
      console.log(err);
    }
  };

  return {
    bulkLoad,
  };
};

export default Database;
