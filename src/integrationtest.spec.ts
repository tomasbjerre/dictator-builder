import fs from 'fs';
const fsextra = require('fs-extra');
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
    const given = path.join(examplesPath, example, 'given');
    const expected = path.join(examplesPath, example, 'expected');
    const actual = path.join(examplesPath, example, 'actual');
    if (fs.existsSync(actual)) {
      console.log(`Removing ${actual}`);
      rimraf.sync(actual);
    }
    console.log(`Copy ${given} to ${actual}`);
    fsextra.copySync(given, actual);

    console.log(`Executing dictator-builder...`);
    dictatorBuilder(new Logger(LEVEL.VERBOSE), actual);

    const res: Result = compareSync(expected, actual, {
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
          `  to equal ${actual}`
      );
    }
    expect(res.differences).toBe(0);
  });
});
