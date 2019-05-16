import path from 'path';
import * as configurationManager from './configuration-manager';

const fs = require('fs');

export const listLocales = () => {
  const localesPath = path.join(
    __dirname,
    configurationManager.readPropertyValue('localesPath')
  );
  const localesList = fs.readdirSync(localesPath).map(file =>
    file
      .split('.')
      .slice(0, -1)
      .join('.')
  );
  return localesList;
};
