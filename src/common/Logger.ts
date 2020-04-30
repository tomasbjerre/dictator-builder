#!/usr/bin/env node

export enum LEVEL {
  VERBOSE = 'VERBOSE',
  INFO = 'INFO',
  ERROR = 'ERROR',
}

export class Logger {
  constructor(private loggingLevel: LEVEL = LEVEL.INFO) {}
  log(level: LEVEL, message?: string, ...optionalParams: any[]) {
    if (this.loggingLevel === LEVEL.INFO && level === LEVEL.VERBOSE) {
      return;
    }
    if (this.loggingLevel === LEVEL.ERROR && level !== LEVEL.ERROR) {
      return;
    }
    if (level === LEVEL.ERROR) {
      if (optionalParams.length > 0) {
        console.error(message, optionalParams);
      } else {
        console.error(message);
      }
    } else {
      if (optionalParams.length > 0) {
        console.log(message, optionalParams);
      } else {
        console.log(message);
      }
    }
  }
}
