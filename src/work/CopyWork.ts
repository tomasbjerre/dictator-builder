import fs from 'fs';
import path from 'path';
import { DictatableConfigAction } from '../types';
import { Work } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';

export class CopyWork implements Work {
  private notApplied: [string, string][];

  constructor(
    private logger: Logger,
    private fileOperations: FileOperations,
    private action: DictatableConfigAction,
    private dictatableName: string
  ) {
    this.notApplied = [];
  }

  public isApplied() {
    const copyFrom = this.fileOperations.getFilesFromGlob(
      this.fileOperations.fileInDictator(
        this.dictatableName,
        this.action.copyFrom!
      )
    );
    const copyTo = this.fileOperations.fileInTarget(this.action.target);

    if (copyFrom.length == 0) {
      this.logger.log(LEVEL.INFO, `0 files matched ${this.action.copyFrom}`);
      return true;
    }
    this.logger.log(
      LEVEL.VERBOSE,
      `Evaluated ${this.action.copyFrom} to ${copyFrom.length} ${copyFrom} will copy to ${copyTo}`
    );
    const targetIsAFile =
      (fs.existsSync(copyTo) && fs.statSync(copyTo).isFile()) ||
      !fs.existsSync(copyTo);
    if (copyFrom.length == 1 && targetIsAFile) {
      this.notApplied = [[copyFrom[0], copyTo]];
      this.logger.log(LEVEL.VERBOSE, `will copy file to file`, this.notApplied);
    } else {
      this.notApplied = copyFrom.map((copyFrom) => {
        const filename = path.basename(copyFrom);
        return [copyFrom, path.join(copyTo, filename)];
      });
      this.logger.log(
        LEVEL.VERBOSE,
        `will copy files to folder`,
        this.notApplied
      );
    }
    this.notApplied = this.notApplied.filter(
      (it) => !this.fileOperations.isSameFile(it[0], it[1])
    );
    this.logger.log(LEVEL.VERBOSE, `not applied files: `, this.notApplied);
    return this.notApplied.length == 0;
  }

  public apply() {
    for (const [copyFrom, copyTo] of this.notApplied) {
      if (fs.existsSync(copyTo) && fs.statSync(copyTo).isFile()) {
        fs.unlinkSync(copyTo);
      }
      const targetDir = path.dirname(copyTo);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      this.logger.log(LEVEL.VERBOSE, `Copying ${copyFrom} to ${copyTo}`);
      fs.copyFileSync(copyFrom, copyTo);
    }
  }

  public info() {
    return `copy ${this.action.copyFrom} to ${this.action.target}`;
  }
}
