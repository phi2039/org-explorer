/* eslint-disable arrow-body-style */
import predicate from 'predicate';
import cuid from 'cuid';

import { cloneDeep } from 'lodash';

const emptyDoc = {
  type: 'group',
  parent: null,
  name: '[Untitled]',
};

const MemoryPersistenceAdapter = emitter => {
  const data = {
    documents: {},
    version: 0,
  };

  const load = async (documents) => {
    data.documents = cloneDeep(documents);
  };

  const getAllSync = () => data.documents;

  const getVersion = () => data.version;

  /* ***Adapter Implementation*** */
  const getAll = async () => ({ ...data.documents });

  const applyFilter = async (filter) => {
    const predicates = Object.entries(filter).map(([key, { fn, value }]) => {
      return obj => {
        return predicate[fn](value, obj[key]);
      };
    });
    const docs = Object.values(data.documents)
      .find(doc => predicate.and(predicates.map(pred => pred(doc))));
    return docs;
  };

  const get = async (id) => {
    const doc = data.documents[id];
    if (!doc) {
      console.warn('no document found for id:', id);
    }
    return doc;
  };

  const getMany = async (ids = []) => {
    return ids.reduce((acc, id) => {
      const doc = data.documents[id];
      if (!doc) {
        console.warn('no document found for id:', id);
        return acc;
      }

      return [
        ...acc,
        doc,
      ];
    }, []);
  };

  const find = async (filter) => applyFilter(filter);

  const findOne = async (filter) => {
    const docs = applyFilter(filter);
    if (docs.length) {
      return docs[0];
    }
    return null;
  };

  /* ***Mutations*** */

  const put = async (id, doc) => {
    data.documents[id] = doc;
    data.version += 1;
    return doc;
  };

  const create = async (values) => {
    const id = cuid();
    const item = {
      id,
      ...values,
    };
    emitter.emit('created', item);
    return put(id, item);
  };

  const update = async (id, values) => {
    const doc = data.documents[id];
    if (doc) {
      const item = {
        ...doc,
        ...values,
      };
      emitter.emit('updated', item);
      return put(id, item);
    }
    throw new Error('invalid document id:', id);
  };

  const remove = async (id) => {
    const doc = data.documents[id];
    if (doc) {
      data.version += 1;
      delete data.documents[id];
      emitter.emit('removed', id);
    } else {
      console.warn('no document found for id:', id);
    }
    return { id };
  };

  const open = async (location, { empty }) => {
    if (empty) {
      data.documents = {};
      await create(emptyDoc);
    }
  };

  return {
    load,
    getAllSync,
    getVersion,
    // Adapter Implementation
    open,
    get,
    getMany,
    getAll,
    find,
    findOne,
    create,
    update,
    remove,
  };
};

export default MemoryPersistenceAdapter;
