import { DictatableConfigAction } from '../types';
import { Work, AppliedWork } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';
import { DictatorConfigReader } from '../common/DictatorConfigReader';

export class ItShouldNotBeInGitWork implements Work {
  private targetFile: string;

  constructor(
    fileOperations: FileOperations,
    private action: DictatableConfigAction
  ) {
    this.targetFile = fileOperations.fileInTarget(action.target);
  }

  public isApplied(previouslyApplied: string[]): AppliedWork {
    if (DictatorConfigReader.isIgnored(this.targetFile)) {
      return {
        appliesTo: [this.targetFile],
        isApplied: true,
      };
    }
    Logger.log(LEVEL.VERBOSE, `path should not be in git `, this.targetFile);
    try {
      require('child_process').execSync(
        `git ls-files --error-unmatch "${this.targetFile}" 2>/dev/null`,
        { encoding: 'utf8' }
      ) != 0;
      return {
        appliesTo: [this.targetFile],
        isApplied: false,
      };
    } catch (error) {
      return {
        appliesTo: [this.targetFile],
        isApplied: true,
      };
    }
  }

  public apply(): void {
    require('child_process').execSync(
      `git rm --cached "${this.targetFile}" 2>/dev/null`,
      { encoding: 'utf8' }
    );
  }

  public info() {
    return `should not have ${this.action.target} in git`;
  }
}
