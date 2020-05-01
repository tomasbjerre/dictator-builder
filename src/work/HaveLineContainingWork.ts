import fs from 'fs';
import { DictatableConfigAction } from '../types';
import { Work } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';
var os = require('os');

export class HaveLineContainingWork implements Work {
  private targetFile: string;
  private notApplied: string[];
  constructor(
    private logger: Logger,
    fileOperations: FileOperations,
    private action: DictatableConfigAction
  ) {
    this.targetFile = fileOperations.fileInTarget(action.target);
    this.notApplied = [];
  }

  isApplied(): boolean {
    if (!fs.existsSync(this.targetFile)) {
      return false;
    }
    const content = fs.readFileSync(this.targetFile, 'utf8').split(/\r?\n/);
    this.notApplied = this.action.haveLineContaining!.filter(
      (it) => content.indexOf(it) == -1
    );
    this.logger.log(
      LEVEL.VERBOSE,
      `Found lines not in ${this.targetFile}`,
      this.notApplied
    );
    return this.notApplied.length == 0;
  }

  apply(): void {
    fs.appendFileSync(this.targetFile, os.EOL);
    this.notApplied.forEach((it) => {
      fs.appendFileSync(this.targetFile, it + os.EOL);
    });
  }

  info(): string {
    return `${this.action.target} should have lines`;
  }
}
