import { applyMiddleware, createStore, compose } from 'redux';
import reducers from 'app/redux/reducers';
import { NAVIGATE_TO_HOMESCREEN, LOADING_STATIC_DATA_DONE } from 'app/redux/types';
import { AsyncStorage } from 'react-native';
import { persistStore, autoRehydrate } from 'redux-persist';
import logger from 'redux-logger';

import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import thunkMiddleware from 'redux-thunk';

const client = axios.create({
  // baseURL: 'https://udr-token.ecomedic.vn',
  baseURL: 'http://10.1.20.2:9090',
  responseType: 'json',
  timeout: 5000,
});

const axiosMW = axiosMiddleware(client);

const store = createStore(
  reducers,
  compose(
    autoRehydrate(),
    applyMiddleware(thunkMiddleware, axiosMW, logger),
  )
);

const config = {
  storage: AsyncStorage,
  // blacklist : ['nav', 'map', 'staticData', 'language', 'doctor', 'clinic', 'appointments', 'listFavorite']
  whitelist: ['user'],
};

persistStore(store, config, () => {
  const { user: { isLogin } } = store.getState();

  if (isLogin) {
    store.dispatch({ type: NAVIGATE_TO_HOMESCREEN });
  }

  store.dispatch({ type: LOADING_STATIC_DATA_DONE });
  console.log('PersistStore complete...');
  // }).purge();
});

export default store;
