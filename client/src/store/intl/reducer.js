import locales from '../../config/locales';
import { LOCALE_SELECTED } from './actions';

const intlFactoryReducer = providedLocales => {
  const translations = providedLocales || locales;
  const initialState = { ...translations['en'], locale: 'en' };

  return (state = initialState, action) => {
    switch (action.type) {
      case LOCALE_SELECTED:
        return {
          ...translations[action.locale],
          locale: action.locale
        };

      default:
        return state;
    }
  };
};

export default intlFactoryReducer;
