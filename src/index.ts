#!/usr/bin/env node
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const path = require("path");
const program = require("commander");
const pkgUp = require("pkg-up");
import fs from "fs";
const packageJson = require(pkgUp.sync());

const DEFAULT_DICTATABLES_FOLDER = "dictatables";
const DEFAULT_DICTATABLE_CONFIG = ".dictatable-config.json";

const description = packageJson.description
  ? packageJson.description + ". "
  : "";

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

const dictatables = fs
  .readdirSync(dictatablesFolder)
  .filter((file) =>
    fs
      .statSync(
        path.resolve(dictatablesFolder, file, DEFAULT_DICTATABLE_CONFIG)
      )
      .isFile()
  );

console.log(`Found ${dictatables.length} dictatables:\n\n`, dictatables, "\n");
