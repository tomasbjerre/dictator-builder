import { HaveLineContainingWork } from './HaveLineContainingWork';
import { DictatorConfigReader } from '../common/DictatorConfigReader';

export class HaveLineContainingFileWork extends HaveLineContainingWork {
  isApplied() {
    super.getNotApplied(this.action.haveLineContainingFile);
    this.notApplied = this.notApplied.filter(
      (it) => !DictatorConfigReader.isIgnored(it)
    );
    return this.notApplied.length == 0;
  }
}
