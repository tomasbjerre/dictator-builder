# Dictator Builder

[![NPM](https://img.shields.io/npm/v/dictator-builder.svg?style=flat-square) ](https://www.npmjs.com/package/dictator-builder)
[![Build Status](https://travis-ci.org/tomasbjerre/dictator-builder.svg?branch=master)](https://travis-ci.org/tomasbjerre/dictator-builder)

A tool designed to help create dictators. A dictator dictates how parts of a folder should look like. Originally designed to avoid code duplication in source code repositories.

When working with `npm` within an organization you typically agree on some parts of the `package.json`, like some `scripts` that should always be there or some `dependencies` that should, or should not, be used. You may also have identical linting configurations like `tsconfig.json`, `.prettierignore`, `.prettierrc.json`... in every repository.

A dictator is basically just a command line tool distributed with NPM. The package is self contained including all files and configuration needed. A user can **work with any language**, or tools, as the dictator is run from command line and its only output are files.

See the examples:

- [Haffaz Dictator](https://github.com/tomasbjerre/dictator-haffaz), try it with: `npx haffaz@latest`.
- [Cypress Dictator](https://github.com/tomasbjerre/dictator-cypress), try it with: `npx dictator-cypress@latest`.
- [React Boilerplate](https://github.com/tomasbjerre/dictator-react-boilerplate), try it with: `npx dictator-react-boilerplate@latest`.

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
    "your-dictator-name": "./index.js"
  },
  "dependencies": {
    "dictator-builder": "^a.b.c"
  }
}
```

Create an `index.js` file containing:

```javascript
#!/usr/bin/env node
require('dictator-builder/lib/index.lib').run(__dirname);
```

You need a folder `/dictatables/[dictatableName]/[dictatableConfig]` like:

```bash
/dictatables/a_dictatable/.dictatable-config.json
/dictatables/another_dictatable/.dictatable-config.json
/dictatables/another_dictatable/some_file
```

- `dictatableName` is something to help organize files and have a name for it.
- `dictatableConfig` is at least the `.dictatable-config.json` file containg [DictatableConfig](/src/types.d.ts). Rules when to apply it and such.
  - You can also place other files in `dictatableConfig` folder and refer to them from `dictatable-config.json`.

The dictatable config is documented with:

- A [markdown file](/dictatableconfig.md) in the repository
- A `dictatableconfig.schema.json` in the distributed package
- TypeScript types [here](/src/types.d.ts)

## Using dictator

It can be used from command line like `npx dictatorname` or `npx dictatorname@version`:

```bash
<dictator-name> [options]

Options:
  -V, --version          output the version number
  -l, --logging <level>  One of VERBOSE,INFO,ERROR default is INFO.
  -d, --dry-run          Only show what will be done.
  -c, --check            Fail if all requirements are not fulfilled.
  -nb, --no-banner       Do not print banner.
  -h, --help             display help for command
```

The folder to be dictated can place an optoinal `.dictatorconfig.json` file in its root to make some adjustments. The dictator config is documented with:

- A [markdown file](/dictatorconfig.md) in the repository
- A `dictatorconfig.schema.json` in the distributed package
- TypeScript types [here](/src/types.d.ts)

### NPM

If you are working with NPM you may use it with some variations.

You may add it as a `dependency`. This means you can easily manage version updates. Also you can add some extra packages to the package and use it as a meta-package, depend on it and you will get its transitive dependencies.

```json
{
  "name": "dictator-example",
  "version": "0.0.1",
  "description": "Just example",
  "scripts": {
    "prepare": "dictatorname"
  },
  "dependencies": {
    "dictatorname": "0.0.28"
  }
}
```

Or just in `prepare` or `preinstall`:

```json
{
  "name": "dictator-example",
  "version": "0.0.1",
  "description": "Just example",
  "scripts": {
    "prepare": "npx dictatorname@0.0.28"
  }
}
```
