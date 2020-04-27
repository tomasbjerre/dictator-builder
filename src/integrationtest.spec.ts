import fs from 'fs';
import path from 'path';
const copyfiles = require('copyfiles');
var rimraf = require("rimraf");

test('test examples', () => {
  const examples = fs.readdirSync(path.join(__dirname, '..', 'examples'));
  examples.forEach((example) => {
    console.log(
      `\n\n------------------------------------------------\n` +
        `  Testing ${example}\n` +
        `------------------------------------------------\n\n`
    );
    const given = path.join(example,'given')
    const actual = path.join(example,'actual')
    if (fs.existsSync(actual)) {
        console.log(`Removing ${actual}`)
        rimraf.sync(actual);
    }
    console.log(`Copy ${given} to ${actual}`)
    copyfiles([given,actual])

    console.log(`Stting process.cwd() to ${actual}`)
    const spy = jest.spyOn(process, 'cwd');
    spy.mockReturnValue(actual);

    //  jämför med expected
  });
});
