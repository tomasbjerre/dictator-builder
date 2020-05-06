import { DictatableFinder } from './dictatable/DictatableFinder';
import { WorkCreator, Work } from './work/WorkCreator';
import { LEVEL, Logger } from './common/Logger';
import { FileOperations } from './common/FileOperations';
import { DictatorConfigReader } from './common/DictatorConfigReader';

export interface DictatorOptions {
  dryRun: false;
  check: false;
  dictatorPath: string;
}

export function runDictator(
  options: DictatorOptions,
  targetPath = process.cwd()
) {
  DictatorConfigReader.load(targetPath);

  const fileOperations = new FileOperations(options.dictatorPath, targetPath);

  const dictatables = new DictatableFinder(
    options.dictatorPath,
    fileOperations
  ).getDictatables();

  const unappliedDictatables: any = {};
  dictatables.forEach((dictatable) => {
    if (dictatable.message) {
      Logger.log(LEVEL.INFO, dictatable.message);
    }
    const work = new WorkCreator().getWork(dictatable, fileOperations);
    const unapplied = performWork(options, work);
    if (options.check && unapplied.length > 0) {
      unappliedDictatables[dictatable.dictatableName] = unapplied;
    }
  });
  if (options.check && Object.keys(unappliedDictatables).length > 0) {
    Logger.log(
      LEVEL.ERROR,
      `Found dictatables that are not applied:\n`,
      unappliedDictatables
    );
    process.exit(1);
  }
}

function performWork(options: DictatorOptions, work: Work[]): string[] {
  const unapplied: string[] = [];
  work
    .filter((it) => {
      const applied = it.isApplied();
      if (applied) {
        Logger.log(LEVEL.INFO, `    Up to date: ${it.info()}`);
      }
      return !applied;
    })
    .forEach((it) => {
      if (options.check) {
        unapplied.push(it.info());
        return;
      }
      Logger.log(LEVEL.INFO, `    Applying: ${it.info()}`);
      if (!options.dryRun) {
        it.apply();
      }
    });
  return unapplied;
}
