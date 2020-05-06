import fs from 'fs';
import { Logger, LEVEL } from './Logger';
import { Schema, Validator } from 'jsonschema';

export class JSONValidator {
  public static validate(jsonFilePath: string, schemaPath: string): any {
    const dictatableConfigJson = fs.readFileSync(jsonFilePath, 'utf8');
    const validationConfig = JSON.parse(dictatableConfigJson);
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8')) as Schema;
    const v = new Validator();
    const result = v.validate(validationConfig, schema);
    if (!result.valid) {
      const errors = result.errors.map((it) => it.toString()).join('\n');
      const errorString = `The configuration in ${jsonFilePath} is not valid:\n${errors}`;
      Logger.log(LEVEL.ERROR, errorString);
      throw Error(errorString);
    }
    Logger.log(LEVEL.VERBOSE, `read ${jsonFilePath}`, validationConfig);
    return validationConfig;
  }
}
