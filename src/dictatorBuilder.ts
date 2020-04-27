import { DictatableFinder } from "./dictatablesFinder";
import { DictatableConfigVerifier } from "./dictatablesConfigVerifier";
import { DictatableConfigApplier } from "./dictatableConfigApplier";
import { LEVEL, Logger } from "./logging";

export default function runDictator(logger:Logger) {
    const dictatables = new DictatableFinder(logger).getDictatables();
    const dictatableConfigVerifier = new DictatableConfigVerifier();
    const dictatableConfigApplier = new DictatableConfigApplier();

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