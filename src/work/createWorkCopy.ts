import fs from 'fs';
import path from 'path';
import { DictatableConfigCopy } from '../types';
import {
  DEFAULT_DICTATABLES_FOLDER,
  DictatableConfigWithExtras,
} from '../dictatablesFinder';

import { Work } from './workCreator';

export default function createWorkCopy(
    dictatorPath: string,
    targetPath: string,
    config: DictatableConfigWithExtras,
    copy: DictatableConfigCopy
  ): Work {
    return {
      isApplied() {
        const copyTo = path.join(targetPath, copy.to);
        return fs.existsSync(copyTo);
      },
      apply() {
        const copyFrom = path.join(
          dictatorPath,
          DEFAULT_DICTATABLES_FOLDER,
          config.dictatableName,
          copy.from
        );
        const copyTo = path.join(targetPath, copy.to);
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