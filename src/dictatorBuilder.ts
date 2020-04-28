import { DictatableFinder } from './dictatablesFinder';
import { WorkCreator, Work } from './work/workCreator';
import { LEVEL, Logger } from './logging';

export default function runDictator(
  logger: Logger,
  dictatorPath: string,
  targetPath = process.cwd()
) {
  const dictatables = new DictatableFinder(
    logger,
    dictatorPath
  ).getDictatables();
  const workCreator = new WorkCreator(logger, dictatorPath, targetPath);
  const work = ([] as Work[]).concat(
    ...dictatables.map((it) => workCreator.getWork(it))
  );
  work
    .filter((it) => {
      const applied = it.isApplied();
      if (applied) {
        logger.log(LEVEL.INFO, `Up to date: ${it.info()}`);
      }
      return !applied;
    })
    .forEach((it) => {
      logger.log(LEVEL.INFO, `Applying: ${it.info()}`);
      it.apply();
    });
}
