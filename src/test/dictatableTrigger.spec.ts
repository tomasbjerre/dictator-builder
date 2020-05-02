import { DictatableFinder } from '../dictatable/DictatableFinder';
import { Logger, LEVEL } from '../common/Logger';
import { FileOperations } from '../common/FileOperations';
import { DictatableConfigTrigger } from '../types';

let sut: DictatableFinder;
const logger = new Logger(LEVEL.VERBOSE);
let targetFile: string;
let trigger: DictatableConfigTrigger;

beforeEach(() => {
  const dictatoPath = 'nop';
  const targetPath = 'not';
  const fileOperations = new FileOperations(dictatoPath, targetPath);
  sut = new DictatableFinder(logger, dictatoPath, fileOperations);
  targetFile = 'nop';
});

test('can trigger on env variable', () => {
  trigger = {
    haveEnvironmentVariable: {
      name: 'thename',
      value: 'thevalue',
    },
  };

  expect(sut.shouldTrigger(trigger, targetFile, logger)).toBeFalsy();

  process.env['thename'] = 'thevalue';
  expect(sut.shouldTrigger(trigger, targetFile, logger)).toBeTruthy();
});
