import fs from 'fs';
var rimraf = require('rimraf');
import { DictatableConfigAction } from '../types';
import { Work } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';

export class ItShouldNotHavePathWork implements Work {
  private targetFile: string;

  constructor(
    private logger: Logger,
    fileOperations: FileOperations,
    private action: DictatableConfigAction
  ) {
    this.targetFile = fileOperations.fileInTarget(action.target);
  }

  public isApplied() {
    return !fs.existsSync(this.targetFile);
  }

  public apply() {
    if (!fs.existsSync(this.targetFile)) {
      //It may have been removed by one of the iterations in this loop
      return;
    }
    const stat = fs.statSync(this.targetFile);
    if (stat.isDirectory()) {
      this.logger.log(LEVEL.VERBOSE, `removing dif ${this.targetFile}`);
      rimraf.sync(this.targetFile);
    } else {
      this.logger.log(LEVEL.VERBOSE, `removing file ${this.targetFile}`);
      fs.unlinkSync(this.targetFile);
    }
  }

  public info() {
    return `should not have path ${this.action.target}`;
  }
}
