/* eslint-disable arrow-body-style */
import predicate from 'predicate';
import cuid from 'cuid';

import { cloneDeep } from 'lodash';

const mapDoc = ({
  id,
  type,
  parent,
  name,
  description,
  manager,
  payerFacing,
  providerFacing,
  requiresPHI,
  currentFTE,
  managerFTE,
}) => ({
  id,
  type,
  parent,
  name,
  description,
  manager,
  measures: [
    ['payerFacing', type === 'group' ? null : payerFacing === 'Yes'],
    ['providerFacing', type === 'group' ? null : providerFacing === 'Yes'],
    ['requiresPHI', type === 'group' ? null : requiresPHI === 'Yes'],
    ['currentFTE', type === 'group' ? null : (currentFTE || 0)],
    ['managerFTE', type === 'group' ? (managerFTE || 1) : null],
  ].filter(([, val]) => val !== null),
});

// TODO: Enforce immutability for returned objects
const MemoryPersistenceAdapter = () => {
  console.log('initialize entity service');

  const data = {
    documents: {},
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
    console.dir(data.documents);

    console.log(JSON.stringify(Object.values(data.documents).map(mapDoc)));
  };

  // TODO: Is this the right way to enforce immutability?
  const put = async (id, doc) => {
    const enhanced = {
      id,
      ...doc,
    };
    data.documents[id] = enhanced;
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
    load,
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
