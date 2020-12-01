import React from 'react';
import { hot } from 'react-hot-loader/root';

import { Helmet } from 'react-helmet';

import { useView } from '../context/ViewContext';
import { usePersistenceState } from '../context/PersistenceContext';

import Org from './Org';
import Tree from './Tree';

const View = () => {
  const [view] = useView();

  if (view === 'hierarchy') {
    return <Org />;
  }

  if (view === 'tree') {
    return <Tree />;
  }

  return <div />; // Unknown view
};

const App = () => {
  const { source } = usePersistenceState();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`OrgExplorer - ${source || '[Untitled]'}`}</title>
      </Helmet>
      {
        source
          ? <View />
          : <div />
      }
    </>
  );
};

export default hot(App);
