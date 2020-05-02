import { Logger, LEVEL } from '../common/Logger';

export default function haveEnvironmentVariable(
  logger: Logger,
  runningOnPlatform: string[]
): boolean {
  logger.log(
    LEVEL.VERBOSE,
    `platform is ${process.platform} and wanted ${runningOnPlatform}`
  );
  return runningOnPlatform.indexOf(process.platform) != -1;
}
