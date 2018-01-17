/**
 * TeleMedicine App index
 * @providesModule TeleMedicine.App
 */

import React from 'react';
import store from 'app/redux/store';
import { Provider } from 'react-redux';
import _ from 'lodash';

import AppWithNavigationState from './navigation';

Object.assign(global, { _ });

export default function TeleMedicine() {
  return (
    <Provider store={store}>
      <AppWithNavigationState />
    </Provider>
  );
}
