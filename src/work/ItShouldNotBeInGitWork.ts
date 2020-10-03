import { DictatableConfigAction } from '../types';
import { Work } from './WorkCreator';
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

  public isApplied() {
    if (DictatorConfigReader.isIgnored(this.targetFile)) {
      return true;
    }
    Logger.log(LEVEL.VERBOSE, `path should not be in git `, this.targetFile);
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

  public apply(touched: string[]): string[] {
    require('child_process').execSync(
      `git rm --cached "${this.targetFile}" 2>/dev/null`,
      { encoding: 'utf8' }
    );
    return [this.targetFile];
  }

  public info() {
    return `should not have ${this.action.target} in git`;
  }
}
