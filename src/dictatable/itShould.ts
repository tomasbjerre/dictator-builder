import { DictatableConfigActionItShould } from '../types';
import fs from 'fs';

export default function itShould(
  targetFile: string | undefined,
  trigger: DictatableConfigActionItShould
): boolean {
  if (!targetFile) {
    throw Error(`targetFile not specified.`);
  }
  if (trigger == 'EXIST') {
    return fs.existsSync(targetFile);
  } else if (trigger == 'NOT_EXIST') {
    return !fs.existsSync(targetFile);
  }
  throw Error(`Unrecognized value: '${itShould}'`);
}
