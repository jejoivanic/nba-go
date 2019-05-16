import path from 'path';

const relativePath = process.env.NODE_ENV === 'production' ? '.' : '..';
const configurationFile = path.join(
  __dirname,
  relativePath,
  'config/configuration.json'
);
const fs = require('fs');

let configurationData;

export const getJsonFileData = file => {
  const rawConfigurationData = fs.readFileSync(file);
  return JSON.parse(rawConfigurationData);
};

export const readPropertyValue = property => {
  if (!configurationData) {
    configurationData = getJsonFileData(configurationFile);
  }
  return configurationData[property];
};

export const savePropertyValue = (property, value) => {
  configurationData[property] = value;
  fs.writeFileSync(
    configurationFile,
    JSON.stringify(configurationData),
    'utf-8'
  );
};
