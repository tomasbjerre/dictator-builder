import { DictatorConfigReader } from '../common/DictatorConfigReader';

test.each([
  ['/a/b/c', '/whatever', '/a/b/c/whatever', true],
  ['/a/b/c', '/whatever', '/whatever', true],
  ['/a/b/c', '/whatever', 'whatever', true],
  ['/a/b/c', '/whatever', '/subfolder/whatever', false],
  ['/a/b/c', '/whatever', 'whatever.json', false],
  ['/a/b/c', '/whatever', '.whatever', false],
  ['/a/b/c', '/*.json', 'whatever', false],
  ['/a/b/c', '/*.json', 'whatever.json', true],
])(
  'targetPath: %s ignored: %s file: %s expected: %s',
  (targetPath, ignored, file, expected) => {
    DictatorConfigReader.load(targetPath);
    DictatorConfigReader.setDictatorConfig({ ignore: [ignored] });
    expect(DictatorConfigReader.isIgnored(file)).toBe(expected);
  }
);
