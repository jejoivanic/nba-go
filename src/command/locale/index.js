import * as locales from '../../utils/locales';
import * as configurationManager from '../../utils/configuration-manager';

const printLocales = () => {
  console.log('List of possibles locales to set:');
  locales.listLocales().forEach(locale => {
    console.log(`- ${locale}`);
  });
  console.log('');
};

const isValidLocale = locale => {
  const matchingLocales = locales
    .listLocales()
    .filter(availableLocale => availableLocale === locale);
  return matchingLocales.length === 1;
};

const locale = option => {
  if (option.list) {
    printLocales();
  } else if (option.set) {
    const selectedLocale = option.set;
    if (isValidLocale(selectedLocale)) {
      configurationManager.savePropertyValue('locale', selectedLocale);
    } else {
      console.log(`The locale '${selectedLocale}' is not valid`);
    }
  }
};

export default locale;
