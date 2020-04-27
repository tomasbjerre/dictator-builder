import fs from 'fs';
import path from 'path';
var rimraf = require('rimraf');
import dictatorBuilder from './dictatorBuilder';
import { Logger, LEVEL } from './logging';
import { compare, compareSync, Options, Result } from 'dir-compare';

test('test examples', () => {
  const examplesPath = path.join(__dirname, '..', 'examples');
  const examples = fs.readdirSync(examplesPath);
  examples.forEach((example) => {
    console.log(
      `\n\n------------------------------------------------\n` +
        `  Testing ${example}\n` +
        `------------------------------------------------\n\n`
    );
    const givenDictator = path.join(examplesPath, example, 'given');
    const expected = path.join(examplesPath, example, 'expected');
    const actualTarget = path.join(examplesPath, example, 'actual');
    if (fs.existsSync(actualTarget)) {
      console.log(`Removing ${actualTarget}`);
      rimraf.sync(actualTarget);
    }

    console.log(`Executing dictator-builder...`);
    dictatorBuilder(new Logger(LEVEL.VERBOSE), givenDictator, actualTarget);

    const res: Result = compareSync(expected, actualTarget, {
      compareContent: true,
      compareDate: false,
      compareSize: false,
      skipSymlinks: true,
    });
    if (res.differences !== 0) {
      console.log(res);
      console.log(
        `Test case: ${example}\n` +
          `  expected ${expected}\n` +
          `  to equal ${actualTarget}`
      );
    }
    expect(res.differences).toBe(0);
  });
});
