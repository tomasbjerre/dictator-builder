#!/usr/bin/env node

import { DictatableConfig } from './types';
import fs from 'fs';
import path from 'path';
export class DictatableConfigVerifier {
  constructor(private dictatorPath: string, private targetPath: string) {}
  verify(config: DictatableConfig): boolean {
    let status = false;
    (config.copy || []).forEach((copy) => {
      const copyTo = path.join(this.targetPath, copy.to);
      if (fs.existsSync(copyTo)) {
        //TODO: comare content
        status = true;
      }
    });
    return false;
  }
}
