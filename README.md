![Build Status](https://img.shields.io/travis/AndreasPizsa/plugin-powered.svg?style=flat-square)
![](https://img.shields.io/codecov/c/github/AndreasPizsa/plugin-powered.svg?style=flat-square)
[![NPM version](https://img.shields.io/npm/v/plugin-powered.svg?style=flat-square)](https://npmjs.org/package/plugin-powered)
[![Greenkeeper badge](https://badges.greenkeeper.io/AndreasPizsa/plugin-powered.svg)](https://greenkeeper.io/)


# plugin-powered 🚀💫

> Your app powered by plugins · Universal Plugin Loader

Plugins are great to build modular, extensible apps. Many frameworks have a `use` or similar method to install plugins or _middleware_, but then the configuration is hardcoded, buried in code.

We can do better.

# Features

+ Add, remove and configure plugins without changing code ✓
+ Install community plugins using `npm` or `yarn` ✓
+ Use a local directory for project-specific plugins ✓
+ Define the load order of plugins ✓
+ Compatible with popular frameworks like Express, Micro, Koa, etc ✓
+ 100% code coverage ✓

### Benefits
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
const loadPlugins = require('plugin-powered')
const plugins = require('./plugins.json')

const app = require('express')()

loadPlugins(app, plugins)
// done! 🚀💫
```

## Installation

```sh
$ npm i plugin-powered
```

# Usage

`loadPlugins(target, plugins[, options])`

or

`loadPlugins(plugins, options)`

## target
`object` | `function` | `Array`

## plugins

## options

#### target
`object` | `function` | `Array`

optionally specifies where plugins should be installed.

#### `use`
optional
`string`
default: 'use'

Name of the `use` method. `target[use]` must be a `function`

#### `errors` optional
`null` | `object` | `function` | `Array` | `Console` | logger

-------------

# Writing Plugins

Writing a plugin is super simple. A plugin is just a regular module that exports a function which takes a single parameter, `options`:

```js
module.exports = function plugin(options) {
  // do things
}
```

## Life Cycle

1. **Resolve Name.** _`baseDir/`_`name`, _`baseDir/prefix-`_`name`, `name`, _`prefix-`_`name`
2. **Loading.** The resolved module name is loaded using `require`.
3. **Initialization.** Its exported `function` is called. `options` is passed as argument unless `options` is `true`, in which case no options are passed.
4. **Use.** If the Initialization step returns a `function`, then it is added to its host by calling the `use` function, i.e. `use(pluginReturnValue)`.
5. **Execution.**

### Plugin `options`

| Value    | Description |
|----------|-------------|
| `false`  | **Disabled.** A plugin that’s set to `false` will not be loaded and its function will not be called. |
| `true`   | **Defaults.** If your plugin accepts options, then the value `true` should mean 'use meaningful defaults'. **Note:** The plugin will be called without any arguments. |
 | _other_ | **Plugin Specific.** Plugin authors are free to define whatever `options` their plugin expects. |
