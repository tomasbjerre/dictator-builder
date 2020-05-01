import { Logger, LEVEL } from '../common/Logger';
import { DictatableConfigWithExtras } from '../dictatable/DictatableFinder';
import { CopyWork } from './CopyWork';
import { FileOperations } from '../common/FileOperations';
import { SubsetOfJsonFileWork } from './SubsetOfJsonFileWork';
import { ChmodWork } from './ChmodWork';
import { HaveJsonPathValuesWork } from './HaveJsonPathValuesWork';
import { NotHaveJsonPathNodesWork } from './NotHaveJsonPathNodesWork';
import { HaveLineContainingWork } from './HaveLineContainingWork';

export interface Work {
  isApplied(): boolean;
  apply(): void;
  info(): string;
}

export class WorkCreator {
  constructor(private logger: Logger) {}
  getWork(
    dictatableConfig: DictatableConfigWithExtras,
    fileOperations: FileOperations
  ): Work[] {
    const work: Work[] = [];
    this.logger.log(
      LEVEL.VERBOSE,
      `Analyzing ${dictatableConfig.dictatableConfigFilename}...`
    );

    (dictatableConfig.actions || []).forEach((action) => {
      if (action.copyFrom) {
        work.push(
          new CopyWork(
            this.logger,
            fileOperations,
            action,
            dictatableConfig.dictatableName
          )
        );
      }
      if (action.beSubsetOfJsonFile) {
        work.push(
          new SubsetOfJsonFileWork(
            this.logger,
            fileOperations,
            action,
            dictatableConfig.dictatableName
          )
        );
      }
      if (action.chmod) {
        work.push(new ChmodWork(this.logger, fileOperations, action));
      }
      if (action.haveJsonPathValues) {
        work.push(
          new HaveJsonPathValuesWork(this.logger, fileOperations, action)
        );
      }
      if (action.notHaveJsonPathNodes) {
        work.push(
          new NotHaveJsonPathNodesWork(this.logger, fileOperations, action)
        );
      }
      if (action.haveLineContaining) {
        work.push(
          new HaveLineContainingWork(this.logger, fileOperations, action)
        );
      }
    });
    return work;
  }
}
