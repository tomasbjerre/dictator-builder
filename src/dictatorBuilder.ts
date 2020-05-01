import { DictatableFinder } from './DictatableFinder';
import { WorkCreator, Work } from './work/WorkCreator';
import { LEVEL, Logger } from './common/Logger';
import { FileOperations } from './common/FileOperations';

export interface DictatorOptions {
  dryRun: false;
  check: false;
  dictatorPath: string;
}

export function runDictator(
  options: DictatorOptions,
  logger: Logger,
  targetPath = process.cwd()
) {
  const fileOperations = new FileOperations(options.dictatorPath, targetPath);

  const dictatables = new DictatableFinder(
    logger,
    options.dictatorPath
  ).getDictatables();

  const unappliedDictatables: any = {};
  dictatables.forEach((dictatable) => {
    if (dictatable.message) {
      logger.log(LEVEL.INFO, dictatable.message);
    }
    const work = new WorkCreator(logger).getWork(dictatable, fileOperations);
    const unapplied = performWork(options, logger, work);
    if (options.check) {
      unappliedDictatables[dictatable.dictatableName] = unapplied;
    }
  });
  if (options.check && Object.keys(unappliedDictatables).length > 0) {
    logger.log(
      LEVEL.ERROR,
      `Found dictatables that are not applied:\n`,
      unappliedDictatables
    );
    process.exit(1)
  }
}

function performWork(
  options: DictatorOptions,
  logger: Logger,
  work: Work[]
): string[] {
  const unapplied: string[] = [];
  work
    .filter((it) => {
      const applied = it.isApplied();
      if (applied) {
        logger.log(LEVEL.INFO, `    Up to date: ${it.info()}`);
      }
      return !applied;
    })
    .forEach((it) => {
      if (options.check) {
        unapplied.push(it.info());
        return;
      }
      logger.log(LEVEL.INFO, `    Applying: ${it.info()}`);
      if (!options.dryRun) {
        it.apply();
      }
    });
  return unapplied;
}
