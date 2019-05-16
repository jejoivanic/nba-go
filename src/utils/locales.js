import path from 'path';
import * as configurationManager from './configuration-manager';

const relativePath = process.env.NODE_ENV === 'production' ? '.' : '..';
const fs = require('fs');

let locale;

const makeLocalesPath = localeToJoin =>
  path.join(
    __dirname,
    relativePath,
    configurationManager.readPropertyValue('localesPath'),
    localeToJoin || ''
  );

export const listLocales = () => {
  const localesPath = makeLocalesPath();
  const localesList = fs.readdirSync(localesPath).map(file =>
    file
      .split('.')
      .slice(0, -1)
      .join('.')
  );
  return localesList;
};

export const setCurrentLocaleData = () => {
  const currentLocale = configurationManager.readPropertyValue('locale');
  const localesPath = makeLocalesPath(currentLocale);
  const currentLocalePath = `${localesPath}.json`;
  locale = configurationManager.getJsonFileData(currentLocalePath);
};

const makeKeyPath = translationValues => {
  const buildingKeyPath = [];
  let traversingTranslationValues = translationValues;
  while (traversingTranslationValues && traversingTranslationValues.key) {
    buildingKeyPath.unshift(traversingTranslationValues.key);
    traversingTranslationValues = traversingTranslationValues.parent;
  }
  return buildingKeyPath.join('.');
};

export const translate = (...keys) => {
  if (!locale) setCurrentLocaleData();
  let translationValue = {};
  keys.every(key => {
    translationValue = {
      key,
      parent: translationValue,
      nestedValue: translationValue.nestedValue
        ? translationValue.nestedValue[key]
        : locale[key],
    };
    return translationValue.nestedValue;
  });
  if (translationValue.nestedValue) {
    if (typeof translationValue.nestedValue === 'string') {
      return translationValue.nestedValue;
    }
    console.error(`The key '${makeKeyPath(translationValue)}' is not a string`);
  } else {
    console.error(
      `The key '${makeKeyPath(
        translationValue
      )}' was not found in the locale file`
    );
  }
};
