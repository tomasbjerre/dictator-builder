export enum LOGGING {
  VERBOSE = 'VERBOSE',
  INFO = 'INFO',
  ERROR = 'ERROR',
}

export interface DictatableConfig {
  message: String;
  copy: DictatableConfigCopy[];
  requirements: DictatableConfigRequirement[];
}

export interface DictatableConfigCopy {
  from: string;
  to: string;
}

export interface DictatableConfigRequirement {
  target: string;
  message: String;
  notHaveJsonPathNodes: DictatableConfigRequirementJsonPath;
  haveJsonPathValues: DictatableConfigRequirementJsonPath;
}

export interface DictatableConfigRequirementJsonPath {
  message: String;
  values: DictatableConfigRequirementJsonPathValue[];
}

export interface DictatableConfigRequirementJsonPathValue {
  message: String;
  expression: string;
  value: String;
}
