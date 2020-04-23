#!/usr/bin/env node
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const pkgUp = require('pkg-up');
const packageJson = require(pkgUp.sync());

const description = (packageJson.description ? packageJson.description + ". " : "")

clear();
console.log(
  chalk.red(
    figlet.textSync(packageJson.name, { horizontalLayout: 'full' })
  )
);

program
  .version(packageJson.version)
  .description(description)
  .parse(process.argv);
