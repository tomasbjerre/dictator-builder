#!/usr/bin/env node
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const path = require("path");
const program = require("commander");
const pkgUp = require("pkg-up");
const fs = require("fs");
const packageJson = require(pkgUp.sync());

const DEFAULT_DICTATABLES_FOLDER = "dictatables";

const description = packageJson.description
  ? packageJson.description + ". "
  : "";

clear();
console.log(
  chalk.green(figlet.textSync(packageJson.name, { horizontalLayout: "full" }))
);

program
  .version(packageJson.version)
  .description(description)
  .parse(process.argv);

const dictatablesFolder = DEFAULT_DICTATABLES_FOLDER;
if (!fs.existsSync(dictatablesFolder)) {
  throw "Was unable to find folder: ${dictatablesFolder}";
}
