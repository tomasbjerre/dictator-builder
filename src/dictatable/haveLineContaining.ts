import fs from 'fs';
import { LEVEL, Logger } from '../common/Logger';
export default function haveLineContaining(
  targetFile: string | undefined,
  expressions: string[]
): boolean {
  if (!targetFile) {
    throw Error(`targetFile not specified.`);
  }
  const content = fs.readFileSync(targetFile, 'utf8').split(/\r?\n/);
  const firstMatch = content.find((it) => {
    if (expressions.indexOf(it) != -1) {
      return true;
    }
    for (const expression in expressions) {
      if (new RegExp(expression).test(it)) {
        return true;
      }
    }
    return false;
  });

  return firstMatch != undefined;
}
