#!/usr/bin/env node

export enum LOGGING {
  VERBOSE = 'VERBOSE',
  INFO = 'INFO',
  ERROR = 'ERROR',
}

export class DictatableConfig {}

import chalk from 'chalk';
const figlet = require('figlet');
import path from 'path';
import program from 'commander';
import fs from 'fs';

const DEFAULT_DICTATABLES_FOLDER = 'dictatables';
const DEFAULT_DICTATABLE_CONFIG = '.dictatable-config.json';

const packageJsonDictator = require(path.join(process.cwd(), 'package.json'));
const description = packageJsonDictator.description
  ? packageJsonDictator.description + '. '
  : '';
console.log(
  chalk.green(
    figlet.textSync(packageJsonDictator.name, { horizontalLayout: 'full' })
  )
);
const packageJsonBuilder = require(path.join(__dirname, '..', 'package.json'));
console.log(
  `Built with ${packageJsonBuilder.name}@${packageJsonBuilder.version}.`
);

program
  .version(packageJsonDictator.version)
  .description(description)
  .option(
    '-l, --logging <level>',
    `One of ${Object.values(LOGGING)} default is ${LOGGING.INFO}.`
  )
  .parse(process.argv);
const loggingLevel: LOGGING = program.logging || 'INFO';

function log(level: LOGGING, message?: string, ...optionalParams: any[]) {
  if (loggingLevel === LOGGING.INFO && level === LOGGING.VERBOSE) {
    return;
  }
  if (loggingLevel === LOGGING.ERROR && level !== LOGGING.ERROR) {
    return;
  }
  if (level === LOGGING.ERROR) {
    if (optionalParams.length > 0) {
      console.error(message, optionalParams);
    } else {
      console.error(message);
    }
  } else {
    if (optionalParams.length > 0) {
      console.log(message, optionalParams);
    } else {
      console.log(message);
    }
  }
  console.log();
}

const dictatablesFolder = DEFAULT_DICTATABLES_FOLDER;
if (!fs.existsSync(dictatablesFolder)) {
  log(LOGGING.ERROR, 'Was unable to find folder: ${dictatablesFolder}');
  process.exit(1);
}

const dictatables = fs
  .readdirSync(dictatablesFolder)
  .filter((file) =>
    fs
      .statSync(
        path.resolve(dictatablesFolder, file, DEFAULT_DICTATABLE_CONFIG)
      )
      .isFile()
  );
if (dictatables.length === 0) {
  log(
    LOGGING.ERROR,
    'Was unable to find any dictatables within folder: ${dictatablesFolder}'
  );
  process.exit(1);
} else {
  log(
    LOGGING.INFO,
    `Found ${dictatables.length} dictatables:\n\n`,
    ...dictatables
  );
}

function verifyConfig(dictatableConfig: DictatableConfig) {
  //TODO
  return false;
}

function applyConfig(dictatableConfig: DictatableConfig) {
  //TODO
}

dictatables.forEach((dictatable) => {
  log(LOGGING.VERBOSE, `Analyzing ${dictatable}...`);
  const dictatableConfigJson = fs.readFileSync(
    path.resolve(dictatablesFolder, dictatable, DEFAULT_DICTATABLE_CONFIG),
    'utf8'
  );
  log(LOGGING.VERBOSE, `Found config:\n`, dictatableConfigJson);
  const dictatableConfig: DictatableConfig = JSON.parse(dictatableConfigJson);

  if (!verifyConfig(dictatableConfig)) {
    log(LOGGING.INFO, `Applying ${dictatable}...`);
    applyConfig(dictatableConfig);
  }
});
