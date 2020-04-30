#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { Logger, LEVEL } from './common/Logger';
import { DictatableConfig } from './types';
import { Validator, Schema } from 'jsonschema';

export const DEFAULT_DICTATABLES_FOLDER = 'dictatables';
const DEFAULT_DICTATABLE_CONFIG = '.dictatable-config.json';

export interface DictatableConfigWithExtras extends DictatableConfig {
  dictatableConfigFilename: string;
  dictatableName: string;
}

export class DictatableFinder {
  constructor(private logger: Logger, private dictatorPath: string) {}
  getDictatables(): DictatableConfigWithExtras[] {
    const dictatablesFolder = this.getDictatablesFolder();

    if (!fs.existsSync(dictatablesFolder)) {
      throw Error(`Was unable to find folder: ${dictatablesFolder}`);
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
      throw Error(
        `Was unable to find any dictatables within folder: ${dictatablesFolder}`
      );
    } else {
      this.logger.log(
        LEVEL.INFO,
        `Found ${dictatables.length} dictatables:\n\n`,
        ...dictatables
      );
      this.logger.log(LEVEL.INFO, ``);
    }

    return dictatables.map((dictatable) => {
      return this.getValidatedDictatableConfig(dictatable);
    });
  }

  private getDictatablesFolder() {
    return path.join(this.dictatorPath, DEFAULT_DICTATABLES_FOLDER);
  }

  private getValidatedDictatableConfig(
    dictatable: string
  ): DictatableConfigWithExtras {
    const jsonFilePath = path.resolve(
      this.getDictatablesFolder(),
      dictatable,
      DEFAULT_DICTATABLE_CONFIG
    );
    const dictatableConfigJson = fs.readFileSync(jsonFilePath, 'utf8');
    const schema = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'schema.json'), 'utf8')
    ) as Schema;
    this.logger.log(LEVEL.VERBOSE, `Found config:\n`, dictatableConfigJson);
    const validationConfig = JSON.parse(dictatableConfigJson);
    const v = new Validator();
    const result = v.validate(validationConfig, schema);
    if (result.valid) {
      validationConfig.dictatableConfigFilename = jsonFilePath;
      validationConfig.dictatableName = dictatable;
      return validationConfig;
    }
    const errors = result.errors.map((it) => it.toString()).join('\n');
    throw Error(
      `The configuration in ${jsonFilePath} is not valid:\n${errors}`
    );
  }
}
