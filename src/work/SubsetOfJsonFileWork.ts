import fs from 'fs';
import { DictatableConfigAction } from '../types';
import { Work } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';
const _ = require('underscore');

export class SubsetOfJsonFileWork implements Work {
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
      action.beSubsetOfJsonFile!
    );
  }

  isApplied(): boolean {
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
    this.patchedTargetFile = _.extend(
      { ...originalTargetFile },
      originalActionFile
    );
    Logger.log(LEVEL.VERBOSE, `${this.targetFile}: `, originalTargetFile);
    Logger.log(LEVEL.VERBOSE, `${this.actionFile}: `, originalActionFile);
    const applied = _.isEqual(this.patchedTargetFile!, originalTargetFile);
    Logger.log(
      LEVEL.VERBOSE,
      `patchedTargetFile: ${applied} `,
      this.patchedTargetFile
    );
    return applied;
  }

  apply(): void {
    Logger.log(LEVEL.VERBOSE, `Writing file ${this.targetFile}`);
    fs.writeFileSync(
      this.targetFile,
      JSON.stringify(this.patchedTargetFile, null, 2),
      {
        encoding: 'utf8',
      }
    );
  }

  info(): string {
    return `${this.action.target} should be subset of JSON in ${this.action.beSubsetOfJsonFile}`;
  }
}
