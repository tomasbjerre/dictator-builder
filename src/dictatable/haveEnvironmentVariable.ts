import { DictatableConfigActionEnvironmentVariable } from '../types';

export default function haveEnvironmentVariable(
  environmentVariable: DictatableConfigActionEnvironmentVariable
): boolean {
  if (environmentVariable.value) {
    const value = process.env[environmentVariable.name];
    return environmentVariable.value == value;
  } else {
    return environmentVariable.name in process.env;
  }
}
