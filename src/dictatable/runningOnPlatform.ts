import { Logger, LEVEL } from '../common/Logger';
import { PLATFORM_TYPE } from '../types';

export default function haveEnvironmentVariable(
  runningOnPlatform: PLATFORM_TYPE
): boolean {
  Logger.log(
    LEVEL.VERBOSE,
    `platform is ${process.platform} and wanted ${runningOnPlatform}`
  );
  return runningOnPlatform == process.platform;
}
