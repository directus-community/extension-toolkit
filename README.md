# create-directus-extension

A command line helper for bootstrapping custom Directus extensions in Typescript and Javascript.

## Installation

This package is meant to be used through `npx` or `yarn`, for example:

```bash
npx create-directus-extension interface my-interface
```

```bash
yarn create directus-extension display my-display
```

## Usage

The tool accepts two arguments and an optional flag:

```bash
npx create-directus-extension <extension-type> <extension-name> [-j]
```

Here `<extension-type>` can be any one of the following:

```
display
interface
layout
module
endpoint
hook
```

which correspond to the different extensions supported by Directus, as explained here: https://docs.directus.io/concepts/extensions/

`<extension-name>` can be any name you choose, and will be used to create a directory for the new extension. Then name you give must not conflict with an existing directory or file!

The CLI generates the project with a Typescript template by default. If you would rather develop the project in Javascript, an optional flag of `-j` or `--javascript` can be given to the `create-directus-extension` command.
