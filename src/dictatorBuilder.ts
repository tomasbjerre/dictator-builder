import { DictatableFinder } from './dictatablesFinder';
import { DictatableConfigVerifier } from './dictatablesConfigVerifier';
import { DictatableConfigApplier } from './dictatableConfigApplier';
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
  const dictatableConfigVerifier = new DictatableConfigVerifier(
    dictatorPath,
    targetPath
  );
  const dictatableConfigApplier = new DictatableConfigApplier(
    dictatorPath,
    targetPath
  );

  dictatables.forEach((dictatableConfig) => {
    logger.log(
      LEVEL.VERBOSE,
      `Analyzing ${dictatableConfig.dictatableConfigFilename}...`
    );
    if (!dictatableConfigVerifier.verify(dictatableConfig)) {
      logger.log(LEVEL.INFO, `Applying ${dictatableConfig.dictatableName}...`);
      dictatableConfigApplier.apply(dictatableConfig);
    }
  });
}
