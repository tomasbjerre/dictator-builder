import path from 'path';
import fs from 'fs';
import { JSONValidator } from './JSONValidator';
import { DictatorConfig, DictatorConfigOptions } from '../types';
import { Logger, LEVEL } from './Logger';
var minimatch = require('minimatch');

export class DictatorConfigReader {
  private static dictatorConfig: DictatorConfig;
  private static targetPath: string;

  public static setDictatorConfig(dictatorConfig: DictatorConfig) {
    this.dictatorConfig = dictatorConfig;
  }

  public static load(targetPath: string) {
    this.targetPath = targetPath;
    const jsonFilePath = path.join(targetPath, '.dictatorconfig.json');
    if (fs.existsSync(jsonFilePath)) {
      const schema = path.join(__dirname, '../dictatorconfig.schema.json');
      this.dictatorConfig = JSONValidator.validate(
        jsonFilePath,
        schema
      ) as DictatorConfig;
    } else {
      this.dictatorConfig = {} as DictatorConfig;
    }

    this.dictatorConfig.ignore = this.dictatorConfig.ignore || [];
    this.dictatorConfig.options =
      this.dictatorConfig.options || ({} as DictatorConfigOptions);
  }

  public static getJsonIndentation(): number {
    return this.dictatorConfig?.options?.jsonIndentation
      ? this.dictatorConfig?.options?.jsonIndentation
      : 2;
  }

  public static isIgnored(file: string): boolean {
    const fileInTarget =
      '/' + file.replace(this.targetPath, '').replace(/^\//g, '');
    return (
      this.dictatorConfig.ignore?.findIndex((pattern) => {
        const match = minimatch(fileInTarget, pattern);
        Logger.log(
          LEVEL.VERBOSE,
          `isIgnored '${match}' with file '${file}' '${fileInTarget}' and pattern '${pattern}'`
        );
        return match;
      }) != -1
    );
  }
}
