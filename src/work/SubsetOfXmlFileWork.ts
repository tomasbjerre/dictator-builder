import fs from 'fs';
import { DictatableConfigAction } from '../types';
import { Work } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';
const _ = require('underscore');
const xml2js = require('xml2js');

export class SubsetOfXmlFileWork implements Work {
  private targetFile: string;
  private actionFile: string;
  private patchedTargetFile?: any;

  constructor(
    private logger: Logger,
    fileOperations: FileOperations,
    private action: DictatableConfigAction,
    dictatableName: string
  ) {
    this.targetFile = fileOperations.fileInTarget(action.target);
    this.actionFile = fileOperations.fileInDictator(
      dictatableName,
      action.beSubsetOfXmlFile!
    );
  }

  isApplied(): boolean {
    let originalActionFile: any = undefined;
    xml2js.parseString(
      fs.readFileSync(this.actionFile, 'utf8'),
      (err: any, result: any) => {
        originalActionFile = result;
        this.logger.log(
          LEVEL.VERBOSE,
          `${this.actionFile}: `,
          originalActionFile
        );
      }
    );
    if (!fs.existsSync(this.targetFile)) {
      this.patchedTargetFile = originalActionFile;
      this.logger.log(
        LEVEL.VERBOSE,
        `target file (${this.targetFile}) does not exist, copying action file`,
        this.patchedTargetFile
      );
      return false;
    }
    let originalTargetFile: any = undefined;
    xml2js.parseString(
      fs.readFileSync(this.targetFile, 'utf8'),
      (err: any, result: any) => {
        originalTargetFile = result;
        this.logger.log(
          LEVEL.VERBOSE,
          `${this.targetFile}: `,
          originalTargetFile
        );
      }
    );
    this.patchedTargetFile = _.extend(
      { ...originalTargetFile },
      originalActionFile
    );
    const applied = _.isEqual(this.patchedTargetFile!, originalTargetFile);
    this.logger.log(
      LEVEL.VERBOSE,
      `patched:\n ${this.actionFile}\n + ${this.targetFile}\n = `,
      this.patchedTargetFile
    );
    return applied;
  }

  apply(): void {
    this.logger.log(LEVEL.VERBOSE, `Writing file ${this.targetFile}`);
    fs.writeFileSync(
      this.targetFile,
      new xml2js.Builder().buildObject(this.patchedTargetFile),
      {
        encoding: 'utf8',
      }
    );
  }

  info(): string {
    return `${this.action.target} should be subset of JSON in ${this.action.beSubsetOfXmlFile}`;
  }
}
