import { Logger, LEVEL } from '../common/Logger';
import { DictatableConfigWithExtras } from '../DictatableFinder';

import { CopyWork } from './CopyWork';
import { FileOperations } from '../common/FileOperations';
import { SubsetOfJsonFileWork } from './SubsetOfJsonFileWork';

export interface Work {
  isApplied(): boolean;
  apply(): void;
  info(): string;
}

export class WorkCreator {
  constructor(private logger: Logger) {}
  getWork(
    config: DictatableConfigWithExtras,
    fileOperations: FileOperations
  ): Work[] {
    const work: Work[] = [];
    this.logger.log(
      LEVEL.VERBOSE,
      `Analyzing ${config.dictatableConfigFilename}...`
    );

    (config.actions || []).forEach((action) => {
      if (action.copyFrom) {
        work.push(
          new CopyWork(
            this.logger,
            fileOperations,
            action,
            config.dictatableName
          )
        );
      }
      if (action.beSubsetOfJsonFile) {
        work.push(
          new SubsetOfJsonFileWork(
            this.logger,
            fileOperations,
            action,
            config.dictatableName
          )
        );
      }
    });
    return work;
  }
}
