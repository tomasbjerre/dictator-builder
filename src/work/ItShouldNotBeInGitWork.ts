import { DictatableConfigAction } from '../types';
import { Work } from './WorkCreator';
import { FileOperations } from '../common/FileOperations';
import { Logger, LEVEL } from '../common/Logger';

export class ItShouldNotBeInGitWork implements Work {
  private targetFile: string;

  constructor(
    private logger: Logger,
    fileOperations: FileOperations,
    private action: DictatableConfigAction
  ) {
    this.targetFile = fileOperations.fileInTarget(action.target);
  }

  public isApplied() {
    this.logger.log(
      LEVEL.VERBOSE,
      `path should not be in git `,
      this.targetFile
    );
    try {
      require('child_process').execSync(
        `git ls-files --error-unmatch "${this.targetFile}" 2>/dev/null`,
        { encoding: 'utf8' }
      ) != 0;
      return false;
    } catch (error) {
      return true;
    }
  }

  public apply() {
    require('child_process').execSync(
      `git rm --cached "${this.targetFile}" 2>/dev/null`,
      { encoding: 'utf8' }
    );
  }

  public info() {
    return `should not have ${this.action.target} in git`;
  }
}
