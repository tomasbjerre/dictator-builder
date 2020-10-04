import fs from 'fs';
import { DictatableConfigAction } from '../types';
import { Work } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';
import { DictatorConfigReader } from '../common/DictatorConfigReader';
const _ = require('underscore');

export class SupersetOfJsonFileWork implements Work {
  private targetFile: string;
  private actionFile: string;
  private patchedTargetFile?: any;

  constructor(
    fileOperations: FileOperations,
    private action: DictatableConfigAction,
    dictatableName: string
  ) {
    this.targetFile = fileOperations.fileInTarget(action.target);
    this.actionFile = fileOperations.fileInDictator(
      dictatableName,
      action.beSupersetOfJsonFile!
    );
  }

  isApplied(): boolean {
    if (DictatorConfigReader.isIgnored(this.targetFile)) {
      return true;
    }
    const originalActionFile = JSON.parse(
      fs.readFileSync(this.actionFile, 'utf8')
    );
    if (!fs.existsSync(this.targetFile)) {
      this.patchedTargetFile = originalActionFile;
      Logger.log(
        LEVEL.VERBOSE,
        `target file (${this.targetFile}) does not exist, copying action file`,
        this.patchedTargetFile
      );
      return false;
    }
    const originalTargetFile = JSON.parse(
      fs.readFileSync(this.targetFile, 'utf8')
    );
    Logger.log(LEVEL.VERBOSE, `${this.targetFile}:\n`, originalTargetFile);
    Logger.log(LEVEL.VERBOSE, `${this.actionFile}:\n`, originalActionFile);
    this.patchedTargetFile = JSON.parse(JSON.stringify(originalTargetFile));
    mergeDeep(this.patchedTargetFile, originalActionFile);
    const applied = _.isEqual(this.patchedTargetFile!, originalTargetFile);
    Logger.log(
      LEVEL.VERBOSE,
      `patchedTargetFile: ${applied}\n`,
      this.patchedTargetFile
    );
    return applied;
  }

  apply(touched: string[]): string[] {
    Logger.log(
      LEVEL.VERBOSE,
      `Writing file ${this.targetFile} with:\n`,
      this.patchedTargetFile
    );
    fs.writeFileSync(
      this.targetFile,
      JSON.stringify(
        this.patchedTargetFile,
        null,
        DictatorConfigReader.getJsonIndentation()
      ),
      {
        encoding: 'utf8',
      }
    );
    return [this.targetFile];
  }

  info(): string {
    return `${this.action.target} should be superset of JSON in ${this.action.beSupersetOfJsonFile}`;
  }
}

/**
 * https://stackoverflow.com/a/34749873/2477084
 */
function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function mergeDeep(target: any, ...sources: any): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}
