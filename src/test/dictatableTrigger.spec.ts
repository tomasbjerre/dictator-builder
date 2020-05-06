import path from 'path';
import { DictatableFinder } from '../dictatable/DictatableFinder';
import { Logger, LEVEL } from '../common/Logger';
import { FileOperations } from '../common/FileOperations';
import { DictatableConfigTrigger, PLATFORM_TYPE } from '../types';

let sut: DictatableFinder;
let targetFile: string;

const ENV_VAR = 'thevalue';
let triggerTrue: DictatableConfigTrigger;
let triggerFalse: DictatableConfigTrigger;

beforeEach(() => {
  const dictatoPath = 'nop';
  const targetPath = __dirname;
  const fileOperations = new FileOperations(dictatoPath, targetPath);
  sut = new DictatableFinder(dictatoPath, fileOperations);
  targetFile = 'nop';

  process.env[ENV_VAR] = 'thevalue';
  triggerTrue = {
    haveEnvironmentVariable: {
      name: ENV_VAR,
      value: 'thevalue',
    },
  };

  triggerFalse = {
    haveEnvironmentVariable: {
      name: ENV_VAR,
      value: 'theothervalue',
    },
  };
});

describe('and', () => {
  test('empty triggers should be false', () => {
    expect(sut.and([])).toBeFalsy();
  });
  test('true should be true', () => {
    expect(sut.and([triggerTrue])).toBeTruthy();
  });
  test('one true and one false trigger should be false', () => {
    expect(sut.and([triggerTrue, triggerFalse])).toBeFalsy();
  });
  test('false should be false', () => {
    expect(sut.and([triggerFalse])).toBeFalsy();
  });
});

describe('or', () => {
  test('empty triggers should be false', () => {
    expect(sut.or([])).toBeFalsy();
  });
  test('true should be true', () => {
    expect(sut.or([triggerTrue])).toBeTruthy();
  });
  test('one true and one false trigger should be false', () => {
    expect(sut.or([triggerTrue, triggerFalse])).toBeTruthy();
  });
  test('false should be false', () => {
    expect(sut.or([triggerFalse])).toBeFalsy();
  });
});

describe('environment variables', () => {
  beforeEach(() => {
    process.env[ENV_VAR] = 'thevalue';
    triggerTrue = {
      haveEnvironmentVariable: {
        name: ENV_VAR,
        value: 'thevalue',
      },
    };

    triggerFalse = {
      haveEnvironmentVariable: {
        name: ENV_VAR,
        value: 'theothervalue',
      },
    };
  });

  test('expected value should trigger', () => {
    expect(sut.shouldTrigger(triggerTrue)).toBeTruthy();
  });
  test('unexpected value should not trigger', () => {
    expect(sut.shouldTrigger(triggerFalse)).toBeFalsy();
  });
});

describe('platform', () => {
  beforeEach(() => {
    triggerTrue = {
      runningOnPlatform: process.platform.toString() as PLATFORM_TYPE,
    };

    triggerFalse = {
      runningOnPlatform: 'sunos',
    };
  });

  test('expected value should trigger', () => {
    expect(sut.shouldTrigger(triggerTrue)).toBeTruthy();
  });
  test('unexpected value should not trigger', () => {
    expect(sut.shouldTrigger(triggerFalse)).toBeFalsy();
  });
});

describe('json path values', () => {
  beforeEach(() => {
    targetFile = path.join(`dictatableTrigger`, `jsonfile.json`);

    triggerTrue = {
      target: targetFile,
      haveJsonPathValue: {
        expression: '$.a',
        value: 'b',
      },
    };

    triggerFalse = {
      target: targetFile,
      haveJsonPathValue: {
        expression: '$.a',
        value: 'c',
      },
    };
  });

  test('expected value should trigger', () => {
    expect(sut.shouldTrigger(triggerTrue)).toBeTruthy();
  });
  test('unexpected value should not trigger', () => {
    expect(sut.shouldTrigger(triggerFalse)).toBeFalsy();
  });
});

describe('line containing', () => {
  let triggerTrueRegexp: DictatableConfigTrigger;
  let triggerFalseRegexp: DictatableConfigTrigger;
  beforeEach(() => {
    targetFile = path.join(`dictatableTrigger`, `textfile.txt`);

    triggerTrue = {
      target: targetFile,
      haveLineContaining: 'line1',
    };

    triggerTrueRegexp = {
      target: targetFile,
      haveLineContaining: '^[a-z0-9]+',
    };

    triggerFalseRegexp = {
      target: targetFile,
      haveLineContaining: '^[0-9]+',
    };

    triggerFalse = {
      target: targetFile,
      haveLineContaining: 'whatever',
    };
  });

  test('expected value should trigger', () => {
    expect(sut.shouldTrigger(triggerTrue)).toBeTruthy();
  });
  test('unexpected value should not trigger', () => {
    expect(sut.shouldTrigger(triggerFalse)).toBeFalsy();
  });
  test('expected value should trigger on regexp', () => {
    expect(sut.shouldTrigger(triggerTrueRegexp)).toBeTruthy();
  });
  test('unexpected value should not trigger on regexp', () => {
    expect(sut.shouldTrigger(triggerFalseRegexp)).toBeFalsy();
  });
});

describe('it should', () => {
  beforeEach(() => {
    targetFile = path.join(`dictatableTrigger`, `textfile.txt`);

    triggerTrue = {
      target: targetFile,
      itShould: 'EXIST',
    };

    triggerFalse = {
      target: targetFile,
      itShould: 'NOT_EXIST',
    };
  });

  test('expected value should trigger', () => {
    expect(sut.shouldTrigger(triggerTrue)).toBeTruthy();
  });
  test('unexpected value should not trigger', () => {
    expect(sut.shouldTrigger(triggerFalse)).toBeFalsy();
  });
});
