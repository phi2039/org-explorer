/* eslint-disable arrow-body-style */
import predicate from 'predicate';
import cuid from 'cuid';

import { cloneDeep } from 'lodash';

import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

// TODO: Enforce immutability for returned objects
const MemoryPersistenceAdapter = ({
  backupInterval = 30000,
} = {}) => {
  const data = {
    documents: {},
    version: 0,
    backupVersion: 0,
  };

  const saveBackup = () => {
    if (data.backupVersion !== data.version) {
      ipcRenderer.send('data-save-wip', data.documents);
    }
    data.backupVersion = data.version;
  };

  const backupJob = setInterval(saveBackup, backupInterval);

  /* ***Adapter Implementation*** */
  const destroy = () => {
    clearInterval(backupJob);
  };

  const flush = async () => {
    ipcRenderer.send('data-save', data.documents);
    data.version = 0;
    data.backupVersion = 0;
  };

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

  const load = async (documents) => {
    console.log('load documents');
    data.documents = cloneDeep(documents);
    data.version = 0;
    data.backupVersion = 0;
    console.dir(data.documents);
  };

  // TODO: Is this the right way to enforce immutability?
  const put = async (id, doc) => {
    const enhanced = {
      id,
      ...doc,
    };
    data.documents[id] = enhanced;
    data.version += 1;
    return enhanced;
  };

  const create = async (item) => {
    const id = cuid();
    return put(id, {
      ...item,
    });
  };

  const createMany = async (items) => {
    const results = await Promise.all(items.map(create));
    return results;
  };

  const update = async (id, values) => {
    const doc = data.documents[id];
    if (doc) {
      return put(id, {
        ...doc,
        ...values,
      });
    }
    throw new Error('invalid document id:', id);
  };

  const updateMany = async (updates) => {
    const results = await Promise.all(updates.map(({ id, values }) => update(id, values)));
    return results;
  };

  const remove = async (id) => {
    const doc = data.documents[id];
    if (doc) {
      data.version += 1;
      delete data.documents[id];
    } else {
      console.warn('no document found for id:', id);
    }
    return { id };
  };

  const removeMany = async (ids) => {
    const results = await Promise.all(ids.map(remove));
    return results;
  };

  return {
    destroy,
    load,
    flush,
    get,
    getMany,
    find,
    findOne,
    create,
    createMany,
    update,
    updateMany,
    remove,
    removeMany,
  };
};

export default MemoryPersistenceAdapter;
