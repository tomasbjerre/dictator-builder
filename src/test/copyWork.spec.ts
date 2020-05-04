import path from 'path';
import { Logger, LEVEL } from '../common/Logger';
import { FileOperations } from '../common/FileOperations';
import { CopyWork } from '../work/CopyWork';
import { DictatableConfigAction } from '../types';

let sut: CopyWork;
const logger = new Logger(LEVEL.VERBOSE);
let targetFile: string;

beforeEach(() => {
  const dictatoPath = 'nop';
  const targetPath = __dirname;
  const logger = new Logger();
  const fileOperations = new FileOperations(logger, dictatoPath, targetPath);
  const action: DictatableConfigAction = {
    target: targetFile,
  };
  const dictatableName = 'copyWorkDictatable';
  sut = new CopyWork(logger, fileOperations, action, dictatableName);
  targetFile = 'nop';
});

describe('copying files', () => {
  test('getRelativeTargetDir', () => {
    const somefolder = path.resolve(__dirname, 'some', 'folder');
    console.log('someFolder', somefolder);

    expect(
      sut.getRelativeTargetDir(
        somefolder + '/file.zip',
        somefolder + '/file.zip'
      )
    ).toEqual('.');

    expect(
      sut.getRelativeTargetDir(somefolder, somefolder + '/to/copy.zip')
    ).toEqual('to');
    expect(
      sut.getRelativeTargetDir(somefolder + '/', somefolder + '/to/copy.zip')
    ).toEqual('to');
    expect(
      sut.getRelativeTargetDir(somefolder + '/', somefolder + '/to/copy.zip')
    ).toEqual('to');
    expect(
      sut.getRelativeTargetDir(somefolder + '/*', somefolder + '/to/copy.zip')
    ).toEqual('to');

    expect(
      sut.getRelativeTargetDir(somefolder + '/*', somefolder + '/to/copy.zip')
    ).toEqual('to');
    expect(
      sut.getRelativeTargetDir(somefolder + '/?a*', somefolder + '/to/copy.zip')
    ).toEqual('to');
    expect(
      sut.getRelativeTargetDir(
        somefolder + '/[a-z]*',
        somefolder + '/to/copy.zip'
      )
    ).toEqual('to');
    expect(
      sut.getRelativeTargetDir(somefolder + '/f*', somefolder + '/to/copy.zip')
    ).toEqual('to');
    expect(
      sut.getRelativeTargetDir(
        somefolder + '/f?a*',
        somefolder + '/to/copy.zip'
      )
    ).toEqual('to');
    expect(
      sut.getRelativeTargetDir(
        somefolder + '/f[a-z]*',
        somefolder + '/to/copy.zip'
      )
    ).toEqual('to');
    expect(
      sut.getRelativeTargetDir(
        somefolder + '/ggg*',
        somefolder + '/to/copy.zip'
      )
    ).toEqual('to');
    expect(
      sut.getRelativeTargetDir(
        somefolder + '/ggg?a*',
        somefolder + '/to/copy.zip'
      )
    ).toEqual('to');
    expect(
      sut.getRelativeTargetDir(
        somefolder + '/ggg[a-z]*',
        somefolder + '/to/copy.zip'
      )
    ).toEqual('to');
  });
});
