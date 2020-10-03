import { Logger, LEVEL } from '../common/Logger';
import { DictatableConfigWithExtras } from '../dictatable/DictatableFinder';
import { CopyWork } from './CopyWork';
import { FileOperations } from '../common/FileOperations';
import { SupersetOfJsonFileWork } from './SupersetOfJsonFileWork';
import { ChmodWork } from './ChmodWork';
import { HaveJsonPathValuesWork } from './HaveJsonPathValuesWork';
import { NotHaveJsonPathNodesWork } from './NotHaveJsonPathNodesWork';
import { HaveLineContainingWork } from './HaveLineContainingWork';
import { ItShouldNotBeInGitWork } from './ItShouldNotBeInGitWork';
import { ItShouldNotHavePathWork } from './ItShouldNotHavePathWork';
import { HaveLineContainingFileWork } from './HaveLineContainingFileWork';

export interface Work {
  isApplied(): boolean;
  apply(touched: string[]): string[];
  info(): string;
}

export class WorkCreator {
  constructor() {}
  getWork(
    dictatableConfig: DictatableConfigWithExtras,
    fileOperations: FileOperations
  ): Work[] {
    const work: Work[] = [];
    Logger.log(
      LEVEL.VERBOSE,
      `Analyzing ${dictatableConfig.dictatableConfigFilename}...`
    );

    (dictatableConfig.actions || []).forEach((action) => {
      if (action.itShould && action.itShould == 'NOT_BE_IN_GIT') {
        work.push(new ItShouldNotBeInGitWork(fileOperations, action));
      }
      if (action.itShould && action.itShould == 'NOT_EXIST') {
        work.push(new ItShouldNotHavePathWork(fileOperations, action));
      }
      if (action.copyFrom) {
        work.push(
          new CopyWork(fileOperations, action, dictatableConfig.dictatableName)
        );
      }
      if (action.beSupersetOfJsonFile) {
        work.push(
          new SupersetOfJsonFileWork(
            fileOperations,
            action,
            dictatableConfig.dictatableName
          )
        );
      }
      if (action.chmod) {
        work.push(new ChmodWork(fileOperations, action));
      }
      if (action.haveJsonPathValues) {
        work.push(new HaveJsonPathValuesWork(fileOperations, action));
      }
      if (action.notHaveJsonPathNodes) {
        work.push(new NotHaveJsonPathNodesWork(fileOperations, action));
      }
      if (action.haveLineContaining) {
        work.push(new HaveLineContainingWork(fileOperations, action));
      }
      if (action.haveLineContainingFile) {
        work.push(new HaveLineContainingFileWork(fileOperations, action));
      }
    });
    return work;
  }
}
