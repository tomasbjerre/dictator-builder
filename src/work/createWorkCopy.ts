import fs from 'fs';
import path from 'path';
import { DictatableConfigCopy } from '../types';
import { Work } from './workCreator';
import { WorkUtils } from './workUtils';

export default function createWorkCopy(
  workUtils: WorkUtils,
  copy: DictatableConfigCopy
): Work {
  const files: string[] = [];
  return {
    isApplied() {
      const copyFrom = workUtils.fileInDictator(copy.from);
      const copyTo = workUtils.fileInTarget(copy.to);
      return workUtils.isSameFile(copyFrom, copyTo);
    },
    apply() {
      const copyFrom = workUtils.fileInDictator(copy.from);
      const copyTo = workUtils.fileInTarget(copy.to);
      if (fs.existsSync(copyTo)) {
        fs.unlinkSync(copyTo);
      }
      const targetDir = path.dirname(copyTo);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
      }
      fs.copyFileSync(copyFrom, copyTo);
    },
    info() {
      return `copy ${copy.from} to ${copy.to}`;
    },
  };
}
