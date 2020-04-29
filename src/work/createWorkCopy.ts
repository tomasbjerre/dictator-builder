import fs from 'fs';
import path from 'path';
import { DictatableConfigCopy } from '../types';
import { Work } from './workCreator';
import { WorkUtils } from './workUtils';
import Glob from 'glob';
import { Logger, LEVEL } from '../logging';

export default function createWorkCopy(
  logger: Logger,
  workUtils: WorkUtils,
  copy: DictatableConfigCopy
): Work {
  let notApplied: [string, string][] = [];
  let copyToDir = false;
  return {
    isApplied() {
      const copyFromEvaluated = Glob.sync(workUtils.fileInDictator(copy.from));
      const copyFilesFiles = copyFromEvaluated.map((it) =>
        fs.statSync(it).isFile() ? [it] : getFilesInFolder(it)
      );
      const copyFrom = ([] as string[]).concat(...copyFilesFiles);
      copyToDir = copyFrom.length > 1;
      const copyTo = workUtils.fileInTarget(copy.to);

      if (copyFrom.length == 0) {
        logger.log(LEVEL.INFO, `0 files matched ${copy.from}`);
        return true;
      }
      logger.log(
        LEVEL.VERBOSE,
        `Evaluated ${copy.from} to ${copyFrom.length} ${copyFrom} will copy to ${copyTo}`
      );
      const targetIsAFile =
        (fs.existsSync(copyTo) && fs.statSync(copyTo).isFile()) ||
        !fs.existsSync(copyTo);
      if (copyFrom.length == 1 && targetIsAFile) {
        notApplied = [[copyFrom[0], copyTo]];
        logger.log(LEVEL.VERBOSE, `will copy file to file`, notApplied);
      } else {
        notApplied = copyFrom.map((copyFrom) => {
          const filename = path.basename(copyFrom);
          return [copyFrom, path.join(copyTo, filename)];
        });
        logger.log(LEVEL.VERBOSE, `will copy files to folder`, notApplied);
      }
      notApplied = notApplied.filter(
        (it) => !workUtils.isSameFile(it[0], it[1])
      );
      logger.log(LEVEL.VERBOSE, `not applied files: `, notApplied);
      return notApplied.length == 0;
    },
    apply() {
      for (const [copyFrom, copyTo] of notApplied) {
        if (fs.existsSync(copyTo) && fs.statSync(copyTo).isFile()) {
          fs.unlinkSync(copyTo);
        }
        const targetDir = path.dirname(copyTo);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir);
        }
        logger.log(LEVEL.VERBOSE, `Copying ${copyFrom} to ${copyTo}`);
        fs.copyFileSync(copyFrom, copyTo);
      }
    },
    info() {
      return `copy ${copy.from} to ${copy.to}`;
    },
  };
}

function getFilesInFolder(dir: string) {
  let results: string[] = [];
  var list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = dir + '/' + file;
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesInFolder(file));
    } else {
      results.push(file);
    }
  });
  return results;
}
