#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { Logger, LEVEL } from './logging';
import { DictatableConfig } from './types';
import { Validator, Schema } from 'jsonschema';

const DEFAULT_DICTATABLES_FOLDER = 'dictatables';
const DEFAULT_DICTATABLE_CONFIG = '.dictatable-config.json';
const dictatablesFolder = DEFAULT_DICTATABLES_FOLDER;

export class DictatableFinder {
  constructor(private logger: Logger) {}
  getDictatables(): DictatableConfig[] {
    if (!fs.existsSync(dictatablesFolder)) {
      this.logger.log(
        LEVEL.ERROR,
        `Was unable to find folder: ${dictatablesFolder}`
      );
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
      this.logger.log(
        LEVEL.ERROR,
        `Was unable to find any dictatables within folder: ${dictatablesFolder}`
      );
      process.exit(1);
    } else {
      this.logger.log(
        LEVEL.INFO,
        `Found ${dictatables.length} dictatables:\n\n`,
        ...dictatables
      );
    }

    return dictatables.map((dictatable) => {
      const dictatableConfigFilePath = path.resolve(
        dictatablesFolder,
        dictatable,
        DEFAULT_DICTATABLE_CONFIG
      );
      return this.getValidatedDictatableConfig(dictatableConfigFilePath);
    });
  }

  private getValidatedDictatableConfig(jsonFilePath: string): DictatableConfig {
    const dictatableConfigJson = fs.readFileSync(jsonFilePath, 'utf8');
    const schema = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'schema.json'), 'utf8')
    ) as Schema;
    this.logger.log(LEVEL.VERBOSE, `Found config:\n`, dictatableConfigJson);
    const validationConfig = JSON.parse(dictatableConfigJson);
    const v = new Validator();
    const result = v.validate(validationConfig, schema);
    if (result.valid) {
      return validationConfig;
    }
    const errors = result.errors.map((it) => it.toString()).join('\n');
    this.logger.log(
      LEVEL.ERROR,
      `The configuration in ${jsonFilePath} is not valid:\n${errors}`
    );
    process.exit(1);
  }
}
