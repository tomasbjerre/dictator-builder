import fs from 'fs';
export default function haveLineContaining(
  targetFile: string | undefined,
  expression: string
): boolean {
  if (!targetFile) {
    throw Error(`targetFile not specified.`);
  }
  const content = fs.readFileSync(targetFile, 'utf8').split(/\r?\n/);
  const firstMatch = content.find((lineContent) => {
    if (expression == lineContent) {
      return true;
    }
    if (new RegExp(expression).test(lineContent)) {
      return true;
    }
    return false;
  });

  return firstMatch != undefined;
}
