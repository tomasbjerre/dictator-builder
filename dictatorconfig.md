# (DictatableConfig)

---

# Sub Schemas

The schema defines the following additional types:

## `DictatableConfig` (object)

The root element of a dictatable configuration file.

Properties of the `DictatableConfig` object:

### `copy` (array)

The object is an array with all elements of the type `DictatableConfigCopy`.

### `message` (string, required)

Optional message

### `requirements` (array)

The object is an array with all elements of the type `DictatableConfigRequirement`.

### `triggers` (array, required)

Conditions that, if met, makes this dictatable run. Empty triggers means it will always run.

The object is an array with all elements of the type `DictatableConfigTrigger`.

## `DictatableConfigCopy` (object)

Properties of the `DictatableConfigCopy` object:

### `cmod` (string)

chmod the file after its copied

### `from` (string, required)

Can be a glob pattern to match many files or folders.

### `to` (string, required)

## `DictatableConfigRequirement` (object)

Properties of the `DictatableConfigRequirement` object:

### `beSubsetOfJsonFile` (DictatableConfigRequirementBeSubsetOfJsonFile)

### `beSubsetOfXmlFile` (DictatableConfigRequirementBeSubsetOfXmlFile)

### `cmod` (string)

The target should have this chmod.

### `haveJsonPathValues` (DictatableConfigRequirementJsonPath)

### `haveLineContaining` (DictatableConfigRequirementLineContaining)

### `haveXPathValues` (DictatableConfigRequirementXPath)

### `itShould` (DictatableConfigRequirementItShould)

### `message` (string, required)

Optional message

### `notHaveJsonPathNodes` (DictatableConfigRequirementJsonPath)

### `notHaveXPathPathNodes` (DictatableConfigRequirementXPath)

### `target` (string, required)

The file to add requirements on.

## `DictatableConfigRequirementBeSubsetOfJsonFile` (object)

Properties of the `DictatableConfigRequirementBeSubsetOfJsonFile` object:

### `file` (string, required)

A file that should contain a superset of the target file.

### `message` (string, required)

Optional message

## `DictatableConfigRequirementBeSubsetOfXmlFile` (object)

Properties of the `DictatableConfigRequirementBeSubsetOfXmlFile` object:

### `file` (string, required)

A file that should contain a superset of the target file.

### `message` (string, required)

Optional message

## `DictatableConfigRequirementItShould` (string)

## `DictatableConfigRequirementJsonPath` (object)

Properties of the `DictatableConfigRequirementJsonPath` object:

### `message` (string, required)

Optional message

### `values` (array, required)

The object is an array with all elements of the type `DictatableConfigRequirementJsonPathValue`.

## `DictatableConfigRequirementJsonPathValue` (object)

Properties of the `DictatableConfigRequirementJsonPathValue` object:

### `expression` (string, required)

JSONPath expression

### `message` (string, required)

Optional message

### `value` (string)

A value that should match.

## `DictatableConfigRequirementLineContaining` (object)

Properties of the `DictatableConfigRequirementLineContaining` object:

### `message` (string, required)

Optional message

### `values` (array, required)

can be regular expression.

The object is an array with all elements of the type `string`.

## `DictatableConfigRequirementXPath` (object)

Properties of the `DictatableConfigRequirementXPath` object:

### `message` (string, required)

Optional message

### `values` (array, required)

The object is an array with all elements of the type `DictatableConfigRequirementXPathValue`.

## `DictatableConfigRequirementXPathValue` (object)

Properties of the `DictatableConfigRequirementXPathValue` object:

### `expression` (string, required)

XPath expression

### `message` (string, required)

Optional message

### `value` (string)

A value that should match.

## `DictatableConfigTrigger` (object)

Properties of the `DictatableConfigTrigger` object:

### `haveJsonPathValues` (DictatableConfigRequirementJsonPath)

### `haveLineContaining` (DictatableConfigRequirementLineContaining)

### `haveXPathValues` (DictatableConfigRequirementXPath)

### `itShould` (DictatableConfigRequirementItShould)

### `notHaveJsonPathNodes` (DictatableConfigRequirementJsonPath)

### `notHaveXPathPathNodes` (DictatableConfigRequirementXPath)

### `target` (string, required)

The file to trigger on.