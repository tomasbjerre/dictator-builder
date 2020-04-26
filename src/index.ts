#!/usr/bin/env node

import chalk from 'chalk';
const figlet = require('figlet');
import path from 'path';
import program from 'commander';
import { Logger, LEVEL } from './logging';
import { DictatableFinder } from './dictatablesFinder';
import { DictatableConfigVerifier } from './dictatablesConfigVerifier';
import { DictatableConfigApplier } from './dictatableConfigApplier';

export enum LOGGING {
  VERBOSE = 'VERBOSE',
  INFO = 'INFO',
  ERROR = 'ERROR',
}

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
  `  Built with ${packageJsonBuilder.name}@${packageJsonBuilder.version}.`
);
console.log('  https://github.com/tomasbjerre/dictator-builder\n');

program
  .version(packageJsonDictator.version)
  .description(description)
  .option(
    '-l, --logging <level>',
    `One of ${Object.values(LOGGING)} default is ${LOGGING.INFO}.`
  )
  .parse(process.argv);
const logger = new Logger(program.logging || LEVEL.INFO);

const dictatables = new DictatableFinder(logger).getDictatables();
const dictatableConfigVerifier = new DictatableConfigVerifier();
const dictatableConfigApplier = new DictatableConfigApplier();

dictatables.forEach((dictatableConfig) => {
  logger.log(LEVEL.VERBOSE, `Analyzing ${dictatableConfig}...`);
  if (!dictatableConfigVerifier.verify(dictatableConfig)) {
    logger.log(LEVEL.INFO, `Applying ${dictatableConfig}...`);
    dictatableConfigApplier.apply(dictatableConfig);
  }
});
