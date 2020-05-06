import fs from 'fs';
import {
  DictatableConfigAction,
  DictatableConfigActionExpression,
} from '../types';
import { Work } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';
import { DictatorConfigReader } from '../common/DictatorConfigReader';
const jsonpath = require('jsonpath');
export class HaveJsonPathValuesWork implements Work {
  private targetFileData: any;
  private targetFile: string;
  private notApplied: DictatableConfigActionExpression[];
  constructor(
    private fileOperations: FileOperations,
    private action: DictatableConfigAction
  ) {
    this.targetFileData = fileOperations.getTargetFileData(action.target);
    this.targetFile = fileOperations.fileInTarget(action.target);
    this.notApplied = [];
  }

  isApplied(): boolean {
    if (DictatorConfigReader.isIgnored(this.targetFile)) {
      return true;
    }
    this.notApplied = this.action.haveJsonPathValues!.filter((it) => {
      const found = jsonpath.query(this.targetFileData, it.expression);
      Logger.log(
        LEVEL.VERBOSE,
        `Found '${found}' from '${it.expression}' checking against '${it.value}'`
      );
      return found.filter((f: any) => f == it.value);
    });
    return this.notApplied.length == 0;
  }

  apply(): void {
    this.notApplied.forEach((it) => {
      jsonpath.value(this.targetFileData, it.expression, it.value);
    });
    const targetFile = this.fileOperations.fileInTarget(this.action.target);
    const jsonString = JSON.stringify(
      this.targetFileData,
      null,
      DictatorConfigReader.getJsonIndentation()
    );
    fs.writeFileSync(targetFile, jsonString, {
      encoding: 'utf8',
    });
  }

  info(): string {
    return `${this.action.target} should have jsonpath values`;
  }
}
