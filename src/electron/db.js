const { createRxDatabase, addRxPlugin } = require('rxdb');

const { RxDBServerPlugin } = require('rxdb/plugins/server');
const MemoryAdapter = require('pouchdb-adapter-memory');

addRxPlugin(RxDBServerPlugin);
addRxPlugin(MemoryAdapter);

const Database = async () => {
  // create database
  const db = await createRxDatabase({
    name: 'mydb',
    adapter: 'memory',
  });

  // create collection
  const mySchema = {
    version: 0,
    type: 'object',
    properties: {
      key: {
        type: 'string',
        primary: true,
      },
      value: {
        type: 'string',
      },
    },
  };

  await db.collection({
    name: 'items',
    schema: mySchema,
  });

  // insert one document
  await db.items.insert({
    key: 'foo',
    value: 'bar',
  });

  const { app, server } = db.server({
    path: '/db', // (optional)
    port: 3000, // (optional)
    cors: true, // (optional), enable CORS-headers
    startServer: true, // (optional), start express server
    // options of the pouchdb express server
    pouchdbExpressOptions: {
      inMemoryConfig: true, // do not write a config.json
      logPath: '/tmp/rxdb-server-log.txt', // save logs in tmp folder
    },
  });

  return {
    app,
    server,
    db,
  };
};

module.exports = Database;
