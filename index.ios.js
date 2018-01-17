/**
 * TeleMedicine iOS entry point
 * @providesModule TeleMedicine.Entry.IOS
 */

/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import { AppRegistry } from 'react-native';
import App from './app';

// ignore HMR (hot module replacement) warnings
console.disableYellowBox = true;

export default function TeleMedicine() {
  return <App />;
}

AppRegistry.registerComponent('TeleMedicine', () => TeleMedicine);
