import { Logger, LEVEL } from '../common/Logger';
import { PLATFORM_TYPE } from '../types';

export default function haveEnvironmentVariable(
  logger: Logger,
  runningOnPlatform: PLATFORM_TYPE[]
): boolean {
  logger.log(
    LEVEL.VERBOSE,
    `platform is ${process.platform} and wanted ${runningOnPlatform}`
  );
  return (runningOnPlatform as string[]).indexOf(process.platform) != -1;
}
