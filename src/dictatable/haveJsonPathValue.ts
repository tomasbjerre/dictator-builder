import { DictatableConfigActionExpression } from '../types';
const jsonpath = require('jsonpath');
import fs from 'fs';
import { Logger, LEVEL } from '../common/Logger';
export default function haveJsonPathValue(
  logger: Logger,
  targetFile: string | undefined,
  expression: DictatableConfigActionExpression
): boolean {
  if (!targetFile) {
    throw Error(`targetFile not specified.`);
  }

  const targetFileData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
  const found = jsonpath.query(targetFileData, expression.expression);
  logger.log(
    LEVEL.VERBOSE,
    `Found '${found}' from '${expression.expression}' checking against '${expression.value}'`
  );
  return found == expression.value;
}
