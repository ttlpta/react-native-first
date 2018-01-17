import _ from 'lodash';
import I18n from 'react-native-i18n';

const defaultlanguage = ( _.indexOf(['vi', 'en'], I18n.currentLocale()) > -1 ) ? I18n.currentLocale() : 'vi';
const defaultState = {
  defaultlanguage,
};

export default function language(state = defaultState, action) {
  return state;
}