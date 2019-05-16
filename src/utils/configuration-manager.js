import path from 'path';

const configurationFile = path.join(__dirname, './config/configuration.json');
const fs = require('fs');

let configurationData;

export const readPropertyValue = property => {
  if (!configurationData) {
    const rawConfigurationData = fs.readFileSync(configurationFile);
    configurationData = JSON.parse(rawConfigurationData);
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
