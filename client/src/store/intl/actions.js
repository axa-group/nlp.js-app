export const LOCALE_SELECTED = 'LOCALE_SELECTED';

export const localHasBeenUpdated = locale => {
  return {
    type: LOCALE_SELECTED,
    locale
  };
};
