import { DictatableConfigActionExpression } from '../types';
const jsonpath = require('jsonpath');
import fs from 'fs';
import { Logger, LEVEL } from '../common/Logger';
export default function haveJsonPathValues(
  logger: Logger,
  targetFile: string | undefined,
  expressions: DictatableConfigActionExpression[]
): boolean {
  if (!targetFile) {
    throw Error(`targetFile not specified.`);
  }

  const targetFileData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

  return (
    expressions.filter((it) => {
      const found = jsonpath.query(targetFileData, it.expression);
      logger.log(
        LEVEL.VERBOSE,
        `Found '${found}' from '${it.expression}' checking against '${it.value}'`
      );
      return found.filter((f: any) => f == it.value);
    }).length > 0
  );
}
