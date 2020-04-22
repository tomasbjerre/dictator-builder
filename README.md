# Dictator Lib

A library designed to help create dictators. Se the example [Haffaz](https://github.com/tomasbjerre/haffaz) dictator. A dictator is basically just a command line tool distributed with NPM.

## What it solves

In short: helps avoid code duplication when working with many code repositories.

### The problem

When working with many code repositories we often duplicate code within them. It can be entire files like:

- `.browserlistrc`
- `.editorconfig`
- `.prettierignore`

And, or, parts of files. Like in `package.json` you may have an aggreement on some scripts that should always be there:

```json
{
  "scripts": {
    "e2e": "...",
    "e2e:cli": "...",
    "start": "...",
    "build": "..."
  },
  "repository": "..."
}
```

Or another example might be `.gitignore` that, perhaps, should always be a superset of:

```bash
out
bin
.log
```

### This solution

This library treats files as either:

- `OWNED` - Meaning the dictator takes total control of the file.
- `REQUIRED` - Meaning the dictator has some requirements to enforce on the file.

**Owned** files are completely in control of the dictator. They are created, when needed, by the dictator and never committed to version control.

**Required** files are partly maintained by the dictator. Like a JSON file can have some of its attributes enforced while others are left untouched.

This is implemented by this library. The library has supporting functionality to help create such dictators. A dictator is an NPM package that includes all files and configuration needed to decide what needs to be done with a code repository. So we have:

- 1 dictator library.
- 1, or more, dictators. Perhaps if you have both Angular and Vue, you create one dictator to dictate AngularJS repositories and one to dicate Vue repositories.
- 1, or more, code repositories that use 1 dictator.

## Creating a dictator

There is an [example dictator here](https://github.com/tomasbjerre/haffaz) dictator.

What you need is a `/package.json` like:

```json
{
  "name": "your-dictator-name",
  "scripts": {
    "build": "dictator-cli build"
  },
  "dependencies": {
    "dictator-lib": "^a.b.c"
  }
}
```

You also need a folder `/dictatables/[dictatableName]/[dictatableConfig]` like:

```bash
/dictatables/a_dictatable/.dictatable-config.json
/dictatables/another_dictatable/.dictatable-config.json
/dictatables/another_dictatable/some_file
```

- `dictatableName` is something to help organize files and have a name for it.
- `dictatableConfig` is at least `.dictatable-config.json` containg metadata about the folder. Rules when to apply it and such.
  - You can also place other files in `dictatableConfig` folder and refer to them from `dictatable-config.json`.

## The dictatable config

The `.dictatable-config.json` consists of:

```
{
 /**
  * Example: some_file
  */
 "sourceFile": "string"
 /**
  * Example: .gitignore
  */
 "targetFile": "string"
 /**
  * Example: "OWNED" or "REQUIRED"
  */
 "configurationType": "string"
 /**
  * Om configurationType är REQUIRED.
  */
 "contentRequirements": [
  {
   "type": JSONPATH, XPATH
   "expression" "string"
   "value": "string"
  }
 ]
}

```
