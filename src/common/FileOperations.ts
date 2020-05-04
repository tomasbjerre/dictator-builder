import path from 'path';
import fs from 'fs';
import { DEFAULT_DICTATABLES_FOLDER } from '../dictatable/DictatableFinder';
import Glob from 'glob';
import { Logger, LEVEL } from './Logger';

export class FileOperations {
  constructor(
    private logger: Logger,
    private dictatorPath: string,
    private targetPath: string
  ) {}

  public fileInDictator(dictatableName: string, file: string): string {
    return path.join(
      this.dictatorPath,
      DEFAULT_DICTATABLES_FOLDER,
      dictatableName,
      file
    );
  }

  public fileInTarget(file: string): string {
    return path.join(this.targetPath, file);
  }

  public getTargetFileData(file: string): any {
    const targetFile = this.fileInTarget(file);
    return JSON.parse(fs.readFileSync(targetFile, 'utf8'));
  }

  public isSameFile(file1: string, file2: string) {
    if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
      return false;
    }
    const file1Buff = fs.readFileSync(file1);
    const file2Buff = fs.readFileSync(file2);
    return file1Buff.equals(file2Buff);
  }

  public getFilesFromGlob(glob: string) {
    this.logger.log(LEVEL.VERBOSE, `getFilesFromGlob from ${glob}`);
    if (fs.existsSync(glob)) {
      if (fs.statSync(glob).isFile()) {
        this.logger.log(LEVEL.VERBOSE, `getFilesFromGlob is a file`);
        return [glob];
      }
      if (fs.statSync(glob).isDirectory()) {
        this.logger.log(LEVEL.VERBOSE, `getFilesFromGlob is a directory`);
        return this.getFilesInFolder(glob);
      }
    }
    const evaluated = Glob.sync(glob);
    this.logger.log(
      LEVEL.VERBOSE,
      `getFilesFromGlob from evaluated`,
      evaluated
    );
    const filesFiles = evaluated.map((it) => {
      if (fs.statSync(it).isFile()) {
        this.logger.log(LEVEL.VERBOSE, `getFilesFromGlob ${it} is file`);
        return [it];
      } else {
        const files = this.getFilesInFolder(it);
        this.logger.log(
          LEVEL.VERBOSE,
          `getFilesFromGlob ${it} is folder with `,
          files
        );
        return files;
      }
    });
    const flatterned = ([] as string[]).concat(...filesFiles);
    return flatterned;
  }

  public getFilesInFolder(dir: string) {
    let results: string[] = [];
    var list = fs.readdirSync(dir);
    const outer = this;
    list.forEach(function (file) {
      file = dir + '/' + file;
      var stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(outer.getFilesInFolder(file));
      } else {
        results.push(file);
      }
    });
    return results;
  }
}
