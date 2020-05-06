# (DictatorConfig)

---

# Sub Schemas

The schema defines the following additional types:

## `DictatorConfig` (object)

This describes the .dictatorconfig that can be placed in the dictated folder.

Properties of the `DictatorConfig` object:

### `ignore` (array)

List of glob patterns in the folder to ignore.

The object is an array with all elements of the type `string`.

### `options` (DictatorConfigOptions)

## `DictatorConfigOptions` (object)

Properties of the `DictatorConfigOptions` object:

### `jsonIndentation` (number, required)

This indentation will be used when/if manipulating json files.