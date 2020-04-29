/**
 * @description The root element of a dictatable configuration file.
 */
export interface DictatableConfig {
  /**
   * @type string
   * @description Optional message. Can be used to explain this dictatable.
   */
  message?: String;
  /**
   * @description Conditions that, if met, makes this dictatable run. Empty triggers means it will always run.
   */
  triggers?: DictatableConfigTrigger[];
  copy?: DictatableConfigCopy[];
  requirements?: DictatableConfigRequirement[];
}

export interface DictatableConfigTrigger {
  /**
   * @type string
   * @description The file to trigger on.
   */
  target: string;

  haveJsonPathValues?: DictatableConfigRequirementExpression[];
  notHaveJsonPathNodes?: DictatableConfigRequirementExpression[];

  haveXPathValues?: DictatableConfigRequirementExpression[];
  notHaveXPathPathNodes?: DictatableConfigRequirementExpression[];

  haveLineContaining?: DictatableConfigRequirementLineContaining[];
  itShould?: DictatableConfigRequirementItShould;
  haveEnvironmentVariable?: DictatableConfigRequirementEnvironmentVariable;
  notHaveEnvironmentVariable?: DictatableConfigRequirementEnvironmentVariable;
}

export interface DictatableConfigCopy {
  /**
   * @type string
   * @description Can be a glob pattern to match many files or folders.
   */
  from: string;
  /**
   * @type string Can be a file or folder, if it does not exists it will be created as a folder.
   */
  to: string;
}

export interface DictatableConfigRequirement {
  /**
   * @type string
   * @description The file to add requirements on.
   */
  target: string;
  /**
   * @type string
   * @description Optional message. Can be used to explain this requirement.
   */
  message?: String;
  notHaveJsonPathNodes?: DictatableConfigRequirementExpression;
  haveJsonPathValues?: DictatableConfigRequirementExpression;
  /**
   * @type string
   * @description A file that should contain a superset of the target file.
   */
  beSubsetOfJsonFile?: string;
  notHaveXPathPathNodes?: DictatableConfigRequirementExpression;
  haveXPathValues?: DictatableConfigRequirementExpression;
  /**
   * @type string
   * @description A file that should contain a superset of the target file.
   */
  beSubsetOfXmlFile?: string;
  haveLineContaining?: DictatableConfigRequirementLineContaining;
  itShould?: DictatableConfigRequirementItShould;
  /**
   * @description The target should have this chmod.
   */
  chmod?: string;
}

export type DictatableConfigRequirementItShould = 'NOT_EXIST' | 'EXIST';

/**
 * @description These may be used to make the tool behave differently, perhaps
 * copy or patch different files, depending on operating system.
 */
export interface DictatableConfigRequirementEnvironmentVariable {
  /**
   * @type string
   * @description Optional message. Can be used to explain this requirement.
   */
  message?: String;
  /**
   * @type string
   * @description Name of environment variable
   */
  name: string;
  /**
   * @type string
   * @description Optional value of variable
   */
  value?: string;
}

export interface DictatableConfigRequirementExpression {
  /**
   * @type string
   * @description Optional message. Can be used to explain this expression.
   */
  message?: String;
  /**
   * @type string
   * @description Expression
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
   * @description Optional message. Can be used to explain this expression.
   */
  message?: String;
  /**
   * @items.type string
   * @items.minimum 1
   * @description can be regular expression.
   */
  values: string[];
}
