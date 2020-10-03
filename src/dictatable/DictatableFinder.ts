import path from 'path';
import fs from 'fs';
import { Logger, LEVEL } from '../common/Logger';
import { DictatableConfig, DictatableConfigTrigger } from '../types';
import { Validator, Schema } from 'jsonschema';
import haveEnvironmentVariable from './haveEnvironmentVariable';
import runningOnPlatform from './runningOnPlatform';
import haveJsonPathValue from './haveJsonPathValue';
import haveLineContaining from './haveLineContaining';
import itShould from './itShould';
import { FileOperations } from '../common/FileOperations';
import { JSONValidator } from '../common/JSONValidator';
export const DEFAULT_DICTATABLES_FOLDER = 'dictatables';
const DEFAULT_DICTATABLE_CONFIG = '.dictatable-config.json';

export interface DictatableConfigWithExtras extends DictatableConfig {
  dictatableConfigFilename: string;
  dictatableName: string;
}

export class DictatableFinder {
  constructor(
    private dictatorPath: string,
    private fileOperations: FileOperations
  ) {}
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
      Logger.log(
        LEVEL.VERBOSE,
        `Found a total of ${dictatables.length} dictatables:\n\n`,
        JSON.stringify(dictatables)
      );
    }

    const validatedDictatables = dictatables.map((dictatable) => {
      return this.getValidatedDictatableConfig(dictatable);
    });

    const applicableDictatables = validatedDictatables.filter((it) => {
      const noTriggers = (it.triggers || []).length == 0;
      if (noTriggers) {
        return true;
      } else {
        return this.and(it.triggers || []);
      }
    });

    Logger.log(
      LEVEL.VERBOSE,
      `Found a total of ${applicableDictatables.length} applicable dictatables:\n\n`,
      JSON.stringify(applicableDictatables)
    );

    Logger.log(LEVEL.VERBOSE, ``);

    return applicableDictatables;
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

    const validationConfig = JSONValidator.validate(
      jsonFilePath,
      path.join(__dirname, '../dictatableconfig.schema.json')
    );

    validationConfig.dictatableConfigFilename = jsonFilePath;
    validationConfig.dictatableName = dictatable;
    return validationConfig;
  }

  shouldTrigger(trigger: DictatableConfigTrigger): boolean {
    let triggerResult = this.checkTrigger(trigger);
    if (trigger.and && triggerResult) {
      triggerResult = this.and(trigger.and);
    }
    if (trigger.or && !triggerResult) {
      triggerResult = this.or(trigger.or);
    }
    if (trigger.not) {
      triggerResult = !triggerResult;
    }
    Logger.log(
      LEVEL.VERBOSE,
      `shouldTrigger ${JSON.stringify(trigger)} ${triggerResult}`
    );
    return triggerResult;
  }

  or(triggers: DictatableConfigTrigger[]) {
    return (
      triggers.find((trigger) => this.shouldTrigger(trigger) == true) !=
      undefined
    );
  }

  and(triggers: DictatableConfigTrigger[]): boolean {
    const noTriggers = (triggers || []).length == 0;
    if (noTriggers) {
      return false;
    } else {
      return (
        triggers.find((trigger) => this.shouldTrigger(trigger) == false) ==
        undefined
      );
    }
  }

  checkTrigger(trigger: DictatableConfigTrigger): boolean {
    let targetFile = undefined;
    if (trigger.target) {
      targetFile = this.fileOperations.fileInTarget(trigger.target!);
    }
    return (trigger.itShould && itShould(targetFile, trigger.itShould)) ||
      (trigger.runningOnPlatform &&
        runningOnPlatform(trigger.runningOnPlatform)) ||
      (trigger.haveEnvironmentVariable &&
        haveEnvironmentVariable(trigger.haveEnvironmentVariable)) ||
      (trigger.haveJsonPathValue &&
        haveJsonPathValue(targetFile, trigger.haveJsonPathValue)) ||
      (trigger.haveLineContaining &&
        haveLineContaining(targetFile, trigger.haveLineContaining))!
      ? true
      : false;
  }
}
