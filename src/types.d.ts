export interface DictatableConfig {
  /**
   * @type string
   * @description Optional message
   */
  message: String;
  copy?: DictatableConfigCopy[];
  requirements?: DictatableConfigRequirement[];
}

export interface DictatableConfigCopy {
  /**
   * @type string
   * @description Can be a glob pattern to match many files or folders.
   */
  from: string;
  /**
   * @type string
   */
  to: string;

  /**
   * @description chmod the file after its copied
   */
  cmod?: number;
}

export interface DictatableConfigRequirement {
  /**
   * @type string
   * @description The file to add requirements on.
   */
  target: string;
  /**
   * @type string
   * @description Optional message
   */
  message: String;
  notHaveJsonPathNodes?: DictatableConfigRequirementJsonPath;
  haveJsonPathValues?: DictatableConfigRequirementJsonPath;
  beSubsetOfJsonFile?: DictatableConfigRequirementBeSubsetOfJsonFile;
  notHaveXPathPathNodes?: DictatableConfigRequirementXPath;
  haveXPathValues?: DictatableConfigRequirementXPath;
  beSubsetOfXmlFile?: DictatableConfigRequirementBeSubsetOfXmlFile;
  haveLineContaining?: DictatableConfigRequirementLineContaining;
  itShould?: DictatableConfigRequirementItShould;
}

export type DictatableConfigRequirementItShould = 'NOT_EXIST' | 'EXIST';

export interface DictatableConfigRequirementJsonPath {
  /**
   * @type string
   * @description Optional message
   */
  message: String;
  values: DictatableConfigRequirementJsonPathValue[];
}

export interface DictatableConfigRequirementBeSubsetOfJsonFile {
  /**
   * @type string
   * @description Optional message
   */
  message: String;
  /**
   * @type string
   * @description A file that should contain a superset of the target file.
   */
  file: String;
}

export interface DictatableConfigRequirementJsonPathValue {
  /**
   * @type string
   * @description Optional message
   */
  message: String;
  /**
   * @type string
   * @description JSONPath expression
   */
  expression: string;
  /**
   * @type string
   * @description A value that should match.
   */
  value?: String;
}

export interface DictatableConfigRequirementXPath {
  /**
   * @type string
   * @description Optional message
   */
  message: String;
  values: DictatableConfigRequirementXPathValue[];
}

export interface DictatableConfigRequirementBeSubsetOfXmlFile {
  /**
   * @type string
   * @description Optional message
   */
  message: String;
  /**
   * @type string
   * @description A file that should contain a superset of the target file.
   */
  file: String;
}

export interface DictatableConfigRequirementXPathValue {
  /**
   * @type string
   * @description Optional message
   */
  message: String;
  /**
   * @type string
   * @description XPath expression
   */
  expression: string;
  /**
   * @type string
   * @description A value that should match.
   */
  value?: String;
}

export interface DictatableConfigRequirementLineContaining {
  /**
   * @type string
   * @description Optional message
   */
  message: String;
  /**
   * @items.type string
   * @items.minimum 1
   * @description can be regular expression.
   */
  values: string[];
}
