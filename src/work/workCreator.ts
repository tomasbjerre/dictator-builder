#!/usr/bin/env node

import { Logger, LEVEL } from '../logging';
import {
  DictatableConfigWithExtras,
} from '../dictatablesFinder';

import createWorkCopy from './createWorkCopy'

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
    const work: Work[] = [];
    this.logger.log(
      LEVEL.VERBOSE,
      `Analyzing ${config.dictatableConfigFilename}...`
    );

    (config.copy || []).forEach((copy) => {
      work.push(createWorkCopy(this.dictatorPath,this.targetPath,config, copy));
    });
    return work;
  }

}
