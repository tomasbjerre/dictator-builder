import fs from 'fs';
var rimraf = require('rimraf');
import { DictatableConfigAction } from '../types';
import { Work } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';
import { DictatorConfigReader } from '../common/DictatorConfigReader';

export class ItShouldNotHavePathWork implements Work {
  private targetFile: string;

  constructor(
    fileOperations: FileOperations,
    private action: DictatableConfigAction
  ) {
    this.targetFile = fileOperations.fileInTarget(action.target);
  }

  public isApplied() {
    return !fs.existsSync(this.targetFile);
  }

  public apply() {
    if (DictatorConfigReader.isIgnored(this.targetFile)) {
      return true;
    }
    if (!fs.existsSync(this.targetFile)) {
      //It may have been removed by one of the iterations in this loop
      return;
    }
    const stat = fs.statSync(this.targetFile);
    if (stat.isDirectory()) {
      Logger.log(LEVEL.VERBOSE, `removing dif ${this.targetFile}`);
      rimraf.sync(this.targetFile);
    } else {
      Logger.log(LEVEL.VERBOSE, `removing file ${this.targetFile}`);
      fs.unlinkSync(this.targetFile);
    }
  }

  public info() {
    return `should not have path ${this.action.target}`;
  }
}
