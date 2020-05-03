# (DictatableConfig)

---

# Sub Schemas

The schema defines the following additional types:

## `DictatableConfig` (object)

The root element of a dictatable configuration file.

Properties of the `DictatableConfig` object:

### `actions` (array)

Actions to perform if triggered.

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

### `chmod` (string)

The target should have this chmod.

### `copyFrom` (string)

Can be a glob pattern to match many files or folders.

### `haveJsonPathValues` (array)

The object is an array with all elements of the type `DictatableConfigActionExpression`.

### `haveLineContaining` (array)

Will be added to the end of the file if not found.

The object is an array with all elements of the type `string`.

### `itShould` (string)

A path that should EXIST or NOT_EXIST.

### `message` (string)

Optional message. Can be used to explain this requirement.

### `notHaveJsonPathNodes` (array)

The object is an array with all elements of the type `string`.

### `target` (string Can be a file or folder, if it does not exists it will be treated as a folder., required)

## `DictatableConfigActionEnvironmentVariable` (object)

These may be used to make the tool behave differently, perhaps
copy or patch different files, depending on operating system.

Properties of the `DictatableConfigActionEnvironmentVariable` object:

### `name` (string, required)

Name of environment variable

### `value` (string)

Optional value of variable

## `DictatableConfigActionExpression` (object)

Properties of the `DictatableConfigActionExpression` object:

### `expression` (string, required)

Expression

### `value` (string)

A value that should match.

## `DictatableConfigActionItShould` (string)

## `DictatableConfigTrigger` (object)

Properties of the `DictatableConfigTrigger` object:

### `and` (array)

And all these triggers.

The object is an array with all elements of the type `DictatableConfigTrigger`.

### `haveEnvironmentVariable` (DictatableConfigActionEnvironmentVariable)

### `haveJsonPathValue` (DictatableConfigActionExpression)

### `haveLineContaining` (string)

can be regular expression.

### `itShould` (string)

A path that should EXIST or NOT_EXIST.

### `not` (array)

Negate the following triggers.

The object is an array with all elements of the type `DictatableConfigTrigger`.

### `or` (array)

Or any of these triggers.

The object is an array with all elements of the type `DictatableConfigTrigger`.

### `runningOnPlatform` (PLATFORM_TYPE)

Trigger when running on platform. process.platform. https://nodejs.org/api/process.html#process_process_platform

### `target` (string)

The file to trigger on.

## `DictatableConfigTriggerItShould` (string)

## `PLATFORM_TYPE` (string)