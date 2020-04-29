#!/usr/bin/env node

import { Logger, LEVEL } from '../logging';
import { DictatableConfigWithExtras } from '../dictatablesFinder';

import createWorkCopy from './createWorkCopy';
import { WorkUtils } from './workUtils';

export interface Work {
  isApplied(): boolean;
  apply(): void;
  info(): string;
}

export class WorkCreator {
  constructor(
    private logger: Logger,
    private dictatorPath: string,
    private targetPath: string
  ) {}
  getWork(config: DictatableConfigWithExtras): Work[] {
    const workUtils = new WorkUtils(this.dictatorPath, this.targetPath, config);
    const work: Work[] = [];
    this.logger.log(
      LEVEL.VERBOSE,
      `Analyzing ${config.dictatableConfigFilename}...`
    );

    (config.copy || []).forEach((copy) => {
      work.push(createWorkCopy(this.logger, workUtils, copy));
    });
    return work;
  }
}
