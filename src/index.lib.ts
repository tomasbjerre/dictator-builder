import chalk from 'chalk';
const figlet = require('figlet');
import path from 'path';
import program from 'commander';
import { Logger, LEVEL } from './common/Logger';
import { runDictator, DictatorOptions } from './dictatorBuilder';

function printFancyBanner(packageJsonDictator: any) {
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < (packageJsonDictator.name || '').length; i++) {
    const cc = packageJsonDictator.name.charCodeAt(i);
    r += i % 3 == 0 ? cc : 0;
    g += i % 3 == 1 ? cc : 0;
    b += i % 3 == 2 ? cc : 0;
  }
  r = 105 + (r % 11) * 15;
  g = 105 + (g % 11) * 15;
  b = 105 + (b % 11) * 15;
  console.log(
    chalk
      .rgb(r, g, b)
      .bold(
        figlet.textSync(packageJsonDictator.name, { horizontalLayout: 'full' })
      )
  );
  const packageJsonBuilder = require(path.join(
    __dirname,
    '..',
    'package.json'
  ));
  console.log(
    chalk.white(
      `  v.${packageJsonDictator.version} built with ${packageJsonBuilder.name} v.${packageJsonBuilder.version}.\n` +
        chalk.italic(`  ${packageJsonBuilder.homepage}\n`)
    )
  );
}

export function run(dictatorPath: string) {
  const packageJsonDictatorPath = path.join(dictatorPath, 'package.json');
  if (!packageJsonDictatorPath) {
    console.log(`Unable to find package.json within ${dictatorPath}`);
    //This happens when testing with "npm link", so is not failing here!
  }
  const packageJsonDictator = packageJsonDictatorPath
    ? require(packageJsonDictatorPath)
    : {};
  const description = packageJsonDictator.description
    ? packageJsonDictator.description + '. '
    : '';

  program
    .version(packageJsonDictator.version)
    .description(description)
    .option(
      `-l, --logging <level>`,
      `One of ${Object.values(LEVEL)} default is ${LEVEL.INFO}.`
    )
    .option(`-d, --dry-run`, `Only show what will be done.`)
    .option(`-c, --check`, `Fail if all requirements are not fulfilled.`)
    .option(`-nb, --no-banner`, `Do not print banner.`)
    .parse(process.argv);

  if (program.banner) {
    printFancyBanner(packageJsonDictator);
  }

  Logger.setLevel(program.logging || LEVEL.INFO);

  const options: DictatorOptions = {
    dryRun: program.dryRun,
    check: program.check,
    dictatorPath: dictatorPath,
  };
  runDictator(options);
}
