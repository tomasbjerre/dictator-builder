import fs from 'fs';
import { DictatableConfigAction } from '../types';
import { Work } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';
import { DictatorConfigReader } from '../common/DictatorConfigReader';
var os = require('os');

export class HaveLineContainingWork implements Work {
  private targetFile: string;
  private notApplied: string[];
  constructor(
    fileOperations: FileOperations,
    private action: DictatableConfigAction
  ) {
    this.targetFile = fileOperations.fileInTarget(action.target);
    this.notApplied = [];
  }

  isApplied(): boolean {
    if (DictatorConfigReader.isIgnored(this.targetFile)) {
      return true;
    }
    let content: string[] = [];
    if (!fs.existsSync(this.targetFile)) {
      content = [];
    } else {
      content = fs.readFileSync(this.targetFile, 'utf8').split(/\r?\n/);
    }
    this.notApplied = this.action.haveLineContaining!.filter(
      (it) => content.indexOf(it) == -1
    );
    Logger.log(
      LEVEL.VERBOSE,
      `Found lines not in ${this.targetFile}`,
      this.notApplied
    );
    return this.notApplied.length == 0;
  }

  apply(): void {
    if (fs.existsSync(this.targetFile)) {
      Logger.log(LEVEL.VERBOSE, `Appending to file`, this.notApplied);
      fs.appendFileSync(this.targetFile, os.EOL);
      this.notApplied.forEach((it) => {
        fs.appendFileSync(this.targetFile, it + os.EOL);
      });
    } else {
      Logger.log(LEVEL.VERBOSE, `Creating file`, this.notApplied);
      fs.writeFileSync(this.targetFile, this.notApplied.join(os.EOL) + os.EOL, {
        encoding: 'utf8',
      });
    }
  }

  info(): string {
    return `${this.action.target} should have lines`;
  }
}
