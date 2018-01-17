/**
 * TeleMedicine Android entry point
 * @providesModule TeleMedicine.Entry.Android
 */

/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import { AppRegistry } from 'react-native';
import App from './app';

export default function TeleMedicine() {
  return <App />;
}
console.disableYellowBox = true;

AppRegistry.registerComponent('TeleMedicine', () => TeleMedicine);
