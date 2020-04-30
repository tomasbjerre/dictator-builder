# (DictatableConfig)

---

# Sub Schemas

The schema defines the following additional types:

## `DictatableConfig` (object)

The root element of a dictatable configuration file.

Properties of the `DictatableConfig` object:

### `actions` (array)

The object is an array with all elements of the type `DictatableConfigAction`.

### `message` (string)

Optional message. Can be used to explain this dictatable.

### `triggers` (array)

Conditions that, if met, makes this dictatable run. Empty triggers means it will always run.

The object is an array with all elements of the type `DictatableConfigTrigger`.

## `DictatableConfigAction` (object)

Properties of the `DictatableConfigAction` object:

### `beSubsetOfJsonFile` (string)

A file that should contain a superset of the target file.

### `beSubsetOfXmlFile` (string)

A file that should contain a superset of the target file.

### `chmod` (string)

The target should have this chmod.

### `copyFrom` (string)

Can be a glob pattern to match many files or folders.

### `haveJsonPathValues` (DictatableConfigActionExpression)

### `haveLineContaining` (DictatableConfigActionLineContaining)

### `haveXPathValues` (DictatableConfigActionExpression)

### `itShould` (string)

A file that should EXIST or NOT_EXIST.

### `message` (string)

Optional message. Can be used to explain this requirement.

### `notHaveJsonPathNodes` (DictatableConfigActionExpression)

### `notHaveXPathPathNodes` (DictatableConfigActionExpression)

### `target` (string Can be a file or folder, if it does not exists it will be treated as a folder., required)

## `DictatableConfigActionEnvironmentVariable` (object)

These may be used to make the tool behave differently, perhaps
copy or patch different files, depending on operating system.

Properties of the `DictatableConfigActionEnvironmentVariable` object:

### `message` (string)

Optional message. Can be used to explain this requirement.

### `name` (string, required)

Name of environment variable

### `value` (string)

Optional value of variable

## `DictatableConfigActionExpression` (object)

Properties of the `DictatableConfigActionExpression` object:

### `expression` (string, required)

Expression

### `message` (string)

Optional message. Can be used to explain this expression.

### `value` (string)

A value that should match.

## `DictatableConfigActionItShould` (string)

## `DictatableConfigActionLineContaining` (object)

Properties of the `DictatableConfigActionLineContaining` object:

### `message` (string)

Optional message. Can be used to explain this expression.

### `values` (array, required)

can be regular expression.

The object is an array with all elements of the type `string`.

## `DictatableConfigTrigger` (object)

Properties of the `DictatableConfigTrigger` object:

### `haveEnvironmentVariable` (DictatableConfigActionEnvironmentVariable)

### `haveJsonPathValues` (array)

The object is an array with all elements of the type `DictatableConfigActionExpression`.

### `haveLineContaining` (array)

The object is an array with all elements of the type `DictatableConfigActionLineContaining`.

### `haveXPathValues` (array)

The object is an array with all elements of the type `DictatableConfigActionExpression`.

### `itShould` (DictatableConfigActionItShould)

### `notHaveEnvironmentVariable` (DictatableConfigActionEnvironmentVariable)

### `notHaveJsonPathNodes` (array)

The object is an array with all elements of the type `DictatableConfigActionExpression`.

### `notHaveXPathPathNodes` (array)

The object is an array with all elements of the type `DictatableConfigActionExpression`.

### `target` (string, required)

The file to trigger on.
