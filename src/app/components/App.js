import React from 'react';
import { hot } from 'react-hot-loader/root';

import { Helmet } from 'react-helmet';

import { useView } from '../state/ViewContext';
import { useSource, useOrg } from '../state/DataContext';

import Org from './Org';
import Pivot from './Pivot';
import Test from './DataTest';

const View = () => {
  const [view] = useView();
  const orgData = useOrg();
  if (view === 'pivot') {
    return <Pivot orgData={orgData} />;
  }

  if (view === 'hierarchy') {
    return <Org />;
  }

  if (view === 'test') {
    return <Test />;
  }

  return <div />; // Unknown view
};

const App = () => {
  const [source] = useSource();
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
