#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
  DEFAULT_DICTATABLES_FOLDER,
  DictatableConfigWithExtras,
} from './dictatablesFinder';

export class DictatableConfigApplier {
  constructor(private dictatorPath: string, private targetPath: string) {}
  apply(config: DictatableConfigWithExtras) {
    (config.copy || []).forEach((copy) => {
      const copyFrom = path.join(
        this.dictatorPath,
        DEFAULT_DICTATABLES_FOLDER,
        config.dictatableName,
        copy.from
      );
      const copyTo = path.join(this.targetPath, copy.to);
      if (fs.existsSync(copyTo)) {
        fs.unlinkSync(copyTo);
      }
      fs.mkdirSync(path.dirname(copyTo));
      fs.copyFileSync(copyFrom, copyTo);
    });
  }
}
