/**
 * @description The root element of a dictatable configuration file.
 */
export interface DictatableConfig {
  /**
   * @type string
   * @description Optional message. Can be used to explain this dictatable.
   */
  message?: string;
  /**
   * @description Conditions that, if met, makes this dictatable run. Empty triggers means it will always run.
   */
  triggers?: DictatableConfigTrigger[];
  /**
   * @description Actions to perform if triggered.
   */
  actions?: DictatableConfigAction[];
}

export interface DictatableConfigTrigger {
  /**
   * @type string
   * @description Optional message. Can be used to explain this requirement.
   */
  message?: string;
  /**
   * @type string
   * @description The file to trigger on.
   */
  target: string;

  haveJsonPathValues?: DictatableConfigActionExpression[];
  notHaveJsonPathNodes?: DictatableConfigActionExpression[];

  /**
   * @items.type string
   * @items.minimum 1
   * @description can be regular expression.
   */
  haveLineContaining?: string[];
  notHaveXPathPathNodes?: DictatableConfigActionExpression[];
  haveXPathValues?: DictatableConfigActionExpression[];
  itShould?: DictatableConfigActionItShould;
  haveEnvironmentVariable?: DictatableConfigActionEnvironmentVariable;
  notHaveEnvironmentVariable?: DictatableConfigActionEnvironmentVariable;
}

export interface DictatableConfigAction {
  /**
   * @type string
   * @description Optional message. Can be used to explain this requirement.
   */
  message?: string;
  /**
   * @type string Can be a file or folder, if it does not exists it will be treated as a folder.
   */
  target: string;
  /**
   * @type string
   * @description Can be a glob pattern to match many files or folders.
   */
  copyFrom?: string;
  notHaveJsonPathNodes?: DictatableConfigActionExpression[];
  haveJsonPathValues?: DictatableConfigActionExpression[];
  /**
   * @type string
   * @description A file that should contain a superset of the target file.
   */
  beSubsetOfJsonFile?: string;
  /**
   * @items.type string
   * @items.minimum 1
   * @description Will be added to the end of the file if not found.
   */
  haveLineContaining?: string[];
  /**
   * @type string
   * @description A file that should EXIST or NOT_EXIST.
   */
  itShould?: DictatableConfigActionItShould;
  /**
   * @description The target should have this chmod.
   */
  chmod?: string;
}

export type DictatableConfigActionItShould = 'NOT_EXIST' | 'EXIST';

/**
 * @description These may be used to make the tool behave differently, perhaps
 * copy or patch different files, depending on operating system.
 */
export interface DictatableConfigActionEnvironmentVariable {
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

export interface DictatableConfigActionExpression {
  /**
   * @type string
   * @description Expression
   */
  expression: string;
  /**
   * @type string
   * @description A value that should match.
   */
  value?: string;
}
