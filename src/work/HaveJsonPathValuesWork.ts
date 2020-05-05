import fs from 'fs';
import {
  DictatableConfigAction,
  DictatableConfigActionExpression,
} from '../types';
import { Work } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';
const jsonpath = require('jsonpath');
export class HaveJsonPathValuesWork implements Work {
  private targetFileData: any;
  private notApplied: DictatableConfigActionExpression[];
  constructor(
    private logger: Logger,
    private fileOperations: FileOperations,
    private action: DictatableConfigAction
  ) {
    this.targetFileData = fileOperations.getTargetFileData(action.target);
    this.notApplied = [];
  }

  isApplied(): boolean {
    this.notApplied = this.action.haveJsonPathValues!.filter((it) => {
      const found = jsonpath.query(this.targetFileData, it.expression);
      this.logger.log(
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
    const jsonString = JSON.stringify(this.targetFileData, null, 2);
    fs.writeFileSync(targetFile, jsonString, {
      encoding: 'utf8',
    });
  }

  info(): string {
    return `${this.action.target} should have jsonpath values`;
  }
}
