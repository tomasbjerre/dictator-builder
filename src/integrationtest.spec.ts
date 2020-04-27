import fs from 'fs';
const fsextra = require('fs-extra');
import path from 'path';
var rimraf = require('rimraf');
import dictatorBuilder from './dictatorBuilder';
import { Logger, LEVEL } from './logging';

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
    const actual = path.join(examplesPath, example, 'actual');
    if (fs.existsSync(actual)) {
      console.log(`Removing ${actual}`);
      rimraf.sync(actual);
    }
    console.log(`Copy ${given} to ${actual}`);
    fsextra.copySync(given, actual);

    console.log(`Executing dictator-builder...`);
    dictatorBuilder(new Logger(LEVEL.VERBOSE), actual);

    //  jämför med expected
  });
});
