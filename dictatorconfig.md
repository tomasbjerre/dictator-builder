# (DictatableConfig)

---

# Sub Schemas

The schema defines the following additional types:

## `DictatableConfig` (object)

The root element of a dictatable configuration file.

Properties of the `DictatableConfig` object:

### `copy` (array)

The object is an array with all elements of the type `DictatableConfigCopy`.

### `message` (string)

Optional message. Can be used to explain this dictatable.

### `requirements` (array)

The object is an array with all elements of the type `DictatableConfigRequirement`.

### `triggers` (array)

Conditions that, if met, makes this dictatable run. Empty triggers means it will always run.

The object is an array with all elements of the type `DictatableConfigTrigger`.

## `DictatableConfigCopy` (object)

Properties of the `DictatableConfigCopy` object:

### `from` (string, required)

Can be a glob pattern to match many files or folders.

### `to` (string Can be a file or folder, if it does not exists it will be created as a folder., required)

## `DictatableConfigRequirement` (object)

Properties of the `DictatableConfigRequirement` object:

### `beSubsetOfJsonFile` (string)

A file that should contain a superset of the target file.

### `beSubsetOfXmlFile` (string)

A file that should contain a superset of the target file.

### `chmod` (string)

The target should have this chmod.

### `haveJsonPathValues` (DictatableConfigRequirementExpression)

### `haveLineContaining` (DictatableConfigRequirementLineContaining)

### `haveXPathValues` (DictatableConfigRequirementExpression)

### `itShould` (DictatableConfigRequirementItShould)

### `message` (string)

Optional message. Can be used to explain this requirement.

### `notHaveJsonPathNodes` (DictatableConfigRequirementExpression)

### `notHaveXPathPathNodes` (DictatableConfigRequirementExpression)

### `target` (string, required)

The file to add requirements on.

## `DictatableConfigRequirementEnvironmentVariable` (object)

These may be used to make the tool behave differently, perhaps
copy or patch different files, depending on operating system.

Properties of the `DictatableConfigRequirementEnvironmentVariable` object:

### `message` (string)

Optional message. Can be used to explain this requirement.

### `name` (string, required)

Name of environment variable

### `value` (string)

Optional value of variable

## `DictatableConfigRequirementExpression` (object)

Properties of the `DictatableConfigRequirementExpression` object:

### `expression` (string, required)

Expression

### `message` (string)

Optional message. Can be used to explain this expression.

### `value` (string)

A value that should match.

## `DictatableConfigRequirementItShould` (string)

## `DictatableConfigRequirementLineContaining` (object)

Properties of the `DictatableConfigRequirementLineContaining` object:

### `message` (string)

Optional message. Can be used to explain this expression.

### `values` (array, required)

can be regular expression.

The object is an array with all elements of the type `string`.

## `DictatableConfigTrigger` (object)

Properties of the `DictatableConfigTrigger` object:

### `haveEnvironmentVariable` (DictatableConfigRequirementEnvironmentVariable)

### `haveJsonPathValues` (array)

The object is an array with all elements of the type `DictatableConfigRequirementExpression`.

### `haveLineContaining` (array)

The object is an array with all elements of the type `DictatableConfigRequirementLineContaining`.

### `haveXPathValues` (array)

The object is an array with all elements of the type `DictatableConfigRequirementExpression`.

### `itShould` (DictatableConfigRequirementItShould)

### `notHaveEnvironmentVariable` (DictatableConfigRequirementEnvironmentVariable)

### `notHaveJsonPathNodes` (array)

The object is an array with all elements of the type `DictatableConfigRequirementExpression`.

### `notHaveXPathPathNodes` (array)

The object is an array with all elements of the type `DictatableConfigRequirementExpression`.

### `target` (string, required)

The file to trigger on.
