import { DictatableFinder } from './DictatableFinder';
import { WorkCreator, Work } from './work/WorkCreator';
import { LEVEL, Logger } from './common/Logger';
import { FileOperations } from './common/FileOperations';

export default function runDictator(
  logger: Logger,
  dictatorPath: string,
  targetPath = process.cwd()
) {
  const fileOperations = new FileOperations(dictatorPath, targetPath);

  const dictatables = new DictatableFinder(
    logger,
    dictatorPath
  ).getDictatables();

  dictatables.forEach((dictatable) => {
    if (dictatable.message) {
      logger.log(LEVEL.INFO, dictatable.message);
    }
    const work = new WorkCreator(logger).getWork(dictatable, fileOperations);
    performWork(logger, work);
  });
}

function performWork(logger: Logger, work: Work[]) {
  work
    .filter((it) => {
      const applied = it.isApplied();
      if (applied) {
        logger.log(LEVEL.INFO, `    Up to date: ${it.info()}`);
      }
      return !applied;
    })
    .forEach((it) => {
      logger.log(LEVEL.INFO, `    Applying: ${it.info()}`);
      it.apply();
    });
}
