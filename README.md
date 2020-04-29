# Dictator Builder

[![NPM](https://img.shields.io/npm/v/dictator-builder.svg?style=flat-square) ](https://www.npmjs.com/package/dictator-builder)
[![Build Status](https://travis-ci.org/tomasbjerre/dictator-builder.svg?branch=master)](https://travis-ci.org/tomasbjerre/dictator-builder)

A tool designed to help create dictators. A dictator dictates how parts of a folder should look like. Originally designed to avoid code duplication in source code repositories.

When working with `npm` within an organization you typically aggree on some parts of the `package.json`, like some `scripts` that should always be there or some `dependencies` that should, or should not, be used. You may also have an identical `tsconfig.json` in every repository.

A dictator is basically just a command line tool distributed with NPM. The package is self contained including all files and configuration needed. A user can **work with any language**, or tools, as the dictator is run from command line and its only output are files.

Se the example [Haffaz](https://github.com/tomasbjerre/haffaz) dictator, it can be run from command line with: `npx haffaz@latest`.

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

This tool has supporting functionality to help create such dictators. A dictator is an NPM package that includes all files and configuration needed to verify, and apply, requirements to a code repository. So we have:

- 1 dictator-builder (this tool).
- 1, or more, dictators. Perhaps if you have both Angular and Vue, you create one dictator to dictate AngularJS repositories and one to dicate Vue repositories.
- 1, or more, code repositories that use 1, or more, dictators.

## Creating a dictator

There is an [example dictator here](https://github.com/tomasbjerre/haffaz) dictator. There are also [examples](/examples) in this repo used for testing.

What you need is a `/package.json` like:

```json
{
  "name": "your-dictator-name",
  "bin": {
    "dictator-builder": "dictator-builder/lib/index.js"
  },
  "dependencies": {
    "dictator-builder": "^a.b.c"
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
- `dictatableConfig` is at least the `.dictatable-config.json` file containg [DictatableConfig](/src/types.d.ts). Rules when to apply it and such.
  - You can also place other files in `dictatableConfig` folder and refer to them from `dictatable-config.json`.

The dictatable config is documented with:

- A [markdown file](/dictatorconfig.md) in the repository
- A `schema.json` in the distributed package
- TypeScript types [here](/src/types.d.ts)

It can be run like this:

```bash
<dictator-name> [options]

Options:
  -V, --version          output the version number
  -l, --logging <level>  One of VERBOSE,INFO,ERROR default is INFO.
  -d, --dry-run          Only show what will be done.
  -c, --check            Fail if all requirements are not fulfilled.
  -h, --help             display help for command
```
