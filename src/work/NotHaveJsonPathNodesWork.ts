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
const _ = require('underscore');

export class NotHaveJsonPathNodesWork implements Work {
  private targetFileData: any;
  private notApplied: string[];
  constructor(
    private fileOperations: FileOperations,
    private action: DictatableConfigAction
  ) {
    this.targetFileData = fileOperations.getTargetFileData(action.target);
    this.notApplied = [];
  }

  isApplied(): boolean {
    this.notApplied = this.action.notHaveJsonPathNodes!.filter((expression) => {
      const found = jsonpath.query(this.targetFileData, expression);
      Logger.log(LEVEL.VERBOSE, `Found '${found}' from '${expression}'`);
      return found.length > 0;
    });

    return this.notApplied.length == 0;
  }

  apply(): void {
    this.notApplied.forEach((expression) => {
      jsonpath.value(this.targetFileData, expression, null);
    });
    this.removeEmpty(this.targetFileData);
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

  removeEmpty(obj: any): any {
    Object.entries(obj).forEach(([key, val]) => {
      if (val && typeof val === 'object') {
        this.removeEmpty(val);
      } else if (val == null) {
        delete obj[key];
      }
    });
  }
}
