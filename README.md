![Build Status](https://img.shields.io/travis/AndreasPizsa/plugin-powered.svg?style=flat-square)
![](https://img.shields.io/codecov/c/github/AndreasPizsa/plugin-powered.svg?style=flat-square)
[![NPM version](https://img.shields.io/npm/v/plugin-powered.svg?style=flat-square)](https://npmjs.org/package/plugin-powered)
[![Greenkeeper badge](https://badges.greenkeeper.io/AndreasPizsa/plugin-powered.svg)](https://greenkeeper.io/)


# plugin-powered 🚀💫

> Dynamic plugins everywhere

# Motivation

Plugins are great to build modular, extensible apps. Many frameworks have a `use` or similar method to install plugins or _middleware_, but then the configuration is hardcoded, buried in code.

We can do better.

Ideally, you can

+ add, remove and configure plugins without changing code ✓
+ install community plugins using `npm` or `yarn` ✓
+ use a local directory for project-specific plugins ✓
+ configure each plugin without changing code  ✓
+ define the load order of plugins ✓
+ Sometimes you may want to share configurations (like eslint) or build upon others (`extends`) TBD, out of scope

# Benefits

+ Change configuration without touching code
+ Use different configurations for development, test and production
+ Load configurations from files, databases, URLs, etc

## Example: Loading Express middleware

`./plugins.json`
```json
{
  "cors": {
    "origin": "http://example.com",
    "optionsSuccessStatus": 200
  },
  "express-session": {
    "secret": "keyboard cat",
    "resave": false,
    "saveUninitialized": true,
    "cookie": {
      "secure": true
    }
  }
}
```

`index.js`
```js
const usePlugins = require('plugin-powered')
const plugins = require('./plugins.json')

const app = require('express')()

const options = {
  use: app.use.bind(app)
}

usePlugins(plugins, options)
```


## Installation

```sh
$ npm i plugin-powered
```

# Usage

WIP :P

# Writing Plugins

Writing a plugin is super simple. A plugin is just a regular module that exports a function which takes a single parameter, `options`:

```js
module.exports = function plugin(options) {
  // do things
}
```

> **Terminology**
>
> The term **host** is used to generically refer to code that
> uses plugins: apps, frameworks, modules, objects, etc.; if you had a web
> server and wanted to use plugins with it, that web server would be the
> _host_ of your plugins.

## Life Cycle

1. **Loading.** A plugin module is loaded using `require`.
2. **Initialization.** Its exported `function` is called with `options`
3. **Use.** If the Initialization step returns a `function`, then it is added to its host by calling the `use` function, i.e. `use(pluginReturnValue)`.
4. **Execution.**

`plugin-powered` will `require` your module and then execute its exported function.

### Plugin `options`

| Value    | Description |
|----------|-------------|
| `false`  | **Disabled.** A plugin that’s set to `false` will not be loaded and its function will not be called. |
| `true`   | **Defaults.** If your plugin accepts options, then the value `true` should mean 'use meaningful defaults'. **Note:** The plugin will be called without any arguments. |
 | _other_ | **Plugin Specific.** Plugin authors are free to define whatever `options` their plugin expects. |
