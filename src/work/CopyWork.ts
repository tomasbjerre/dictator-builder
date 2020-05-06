import fs from 'fs';
import path from 'path';
import { DictatableConfigAction } from '../types';
import { Work } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';

export class CopyWork implements Work {
  private notApplied: [string, string][];

  constructor(
    private fileOperations: FileOperations,
    private action: DictatableConfigAction,
    private dictatableName: string
  ) {
    this.notApplied = [];
  }

  public isApplied() {
    const copyFromInTarget = this.fileOperations.fileInDictator(
      this.dictatableName,
      this.action.copyFrom!
    );
    const copyFrom = this.fileOperations.getFilesFromGlob(copyFromInTarget);
    const copyTo = this.fileOperations.fileInTarget(this.action.target);

    if (copyFrom.length == 0) {
      Logger.log(
        LEVEL.VERBOSE,
        `copyFromInTarget '${copyFromInTarget}' ${this.dictatableName} ${this.action.copyFrom}`
      );
      Logger.log(LEVEL.INFO, `0 files matched ${this.action.copyFrom}`);
      return true;
    }
    Logger.log(
      LEVEL.VERBOSE,
      `Evaluated ${this.action.copyFrom} to ${copyFrom.length} ${copyFrom} will copy to ${copyTo}`
    );
    this.notApplied = copyFrom.map((copyFromFile) =>
      this.toNotAppliedItem(copyFromFile, copyFromInTarget, copyTo)
    );
    Logger.log(LEVEL.VERBOSE, `will copy file to folder`, this.notApplied);
    this.notApplied = this.notApplied.filter(
      (it) => !this.fileOperations.isSameFile(it[0], it[1])
    );
    Logger.log(LEVEL.VERBOSE, `not applied files: `, this.notApplied);
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
      Logger.log(LEVEL.VERBOSE, `Copying ${copyFrom} to ${copyTo}`);
      fs.copyFileSync(copyFrom, copyTo);
    }
  }

  public info() {
    return `copy ${this.action.copyFrom} to ${this.action.target}`;
  }

  private toNotAppliedItem(
    copyFromFile: string,
    copyFromInTarget: string,
    copyTo: string
  ): [string, string] {
    const filename = path.basename(copyFromFile);
    const relativePath = this.getRelativeTargetDir(
      copyFromInTarget,
      copyFromFile
    );
    const to = path.join(copyTo, relativePath, filename);
    return [copyFromFile, to];
  }

  public getRelativeTargetDir(
    copyFromInTargetParam: string,
    evaluatedCopyFrom: string
  ): string {
    let copyFromInTarget = copyFromInTargetParam;
    let indexOfStart = copyFromInTarget.search(/[\[\*\?]/);
    if (indexOfStart != -1) {
      copyFromInTarget = copyFromInTarget.substring(0, indexOfStart);
      if (!fs.existsSync(copyFromInTarget)) {
        // like /folder/f* becomes /folder
        copyFromInTarget = path.dirname(copyFromInTarget);
      }
    }
    const relativeFile = path.relative(copyFromInTarget, evaluatedCopyFrom);
    return path.dirname(relativeFile);
  }
}
