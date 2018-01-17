import { StatusBar, Platform } from 'react-native';
import { combineReducers } from 'redux';

import nav from './navigation.js';
import staticData from './staticData.js';
import language from './language.js';
import map from './mapView.js';
import user from './user.js';
import clinic, { doctorOfClinic } from './clinic.js';
import doctor from './doctor.js';
import appointments from './appointments';
import booking from './booking.js';
import listFavorite from './listFavorite.js';

if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');
}

const AppReducer = combineReducers({
  user,
  nav,
  map,
  language,
  staticData,
  clinic,
  doctor,
  booking,
  listFavorite,
  doctorOfClinic,
  appointments,
});

export default AppReducer;
