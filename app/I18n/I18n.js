import I18n from 'react-native-i18n';
I18n.fallbacks = true;

// I18n.defaultLocale = 'en';
// I18n.locale = "vi";

I18n.translations = {
  en: require('./en.json'),
  vi: require('./vi.json'),
};

export default I18n;
