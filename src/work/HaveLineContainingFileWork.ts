import { HaveLineContainingWork } from './HaveLineContainingWork';
import { DictatorConfigReader } from '../common/DictatorConfigReader';
import { AppliedWork } from './WorkCreator';

export class HaveLineContainingFileWork extends HaveLineContainingWork {
  isApplied(): AppliedWork {
    super.getNotApplied(this.action.haveLineContainingFile);
    this.notApplied = this.notApplied.filter(
      (it) => !DictatorConfigReader.isIgnored(it)
    );
    return {
      appliesTo: [this.targetFile],
      isApplied: this.notApplied.length == 0,
    };
  }
}
