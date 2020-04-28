import path from 'path';
import fs from 'fs';
import {
  DEFAULT_DICTATABLES_FOLDER,
  DictatableConfigWithExtras,
} from '../dictatablesFinder';

export class WorkUtils {
  constructor(
    private dictatorPath: string,
    private targetPath: string,
    private config: DictatableConfigWithExtras
  ) {}

  public fileInDictator(file: string): string {
    return path.join(
      this.dictatorPath,
      DEFAULT_DICTATABLES_FOLDER,
      this.config.dictatableName,
      file
    );
  }

  public fileInTarget(file: string): string {
    return path.join(this.targetPath, file);
  }

  public isSameFile(file1: string, file2: string) {
    if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
      return false;
    }
    const file1Buff = fs.readFileSync(file1);
    const file2Buff = fs.readFileSync(file2);
    return file1Buff.equals(file2Buff);
  }
}
