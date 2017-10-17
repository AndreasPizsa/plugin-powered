const path = require('path')
module.exports = loadPlugins

function loadPlugins (targetOrPlugins, pluginsOrOptions, options) {

  const useMethod = (options && options.use) || 'use'
  let target = functionForTarget(targetOrPlugins, useMethod)
  let plugins
  if (target) {
    if (options && options.target) {
      throw RangeError('Expected only `target` or `options.target`, found both. Please use only either.')
    }
    plugins = pluginsOrOptions
  } else {
    plugins = targetOrPlugins
    options = pluginsOrOptions
    target  = options && options.target && functionForTarget(options.target, options.use || 'use')

    if (!target) {
      throw ReferenceError('Expected `options.target`')
    }
  }

  options = Object.assign({
    errors: console.error.bind(console),
    prefix: 'plugin-',
    dir: './plugins'
  }, options)

  const logError = functionForTarget(options.errors, 'error')

  return Object.entries(plugins)
    .filter(([name, pluginOptions]) => pluginOptions !== false)
    .map(([name, pluginOptions]) => {
      try {
        const plugin = resolvePlugin(name, options.prefix, options.dir)
        if (!plugin) throw new Error(`Can not find '${name}'`)
        return [name, pluginOptions, plugin]
      } catch (error) {
        logError({ name, error })
      }
    })
    .filter(x => !!x)
    .reduce((promise, [name, pluginOptions, plugin]) => {
      return promise.then(async (plugins) => {
        try {
          plugins[name] = pluginOptions === true
            ? await plugin()
            : await plugin(pluginOptions)
        } catch (error) {
          logError({ name, error })
        }
        return plugins
      })
    }, Promise.resolve({}))
    .then((plugins) => {
      Object
        .values(plugins)
        .filter(plugin => plugin instanceof Function)
        .forEach(plugin => target(plugin))
      return plugins
    })
}

function functionForTarget (target, targetMethodName) {

  // Use an instance method
  if (target instanceof Object &&
      typeof targetMethodName === 'string' &&
      target[targetMethodName] instanceof Function) {
    return target[targetMethodName].bind(target)
  }

  // swallow
  if (target == null) return function () {}

  // call a function
  if (target instanceof Function) return target

  // Push to an array
  if (Array.isArray(target)) return Array.prototype.push.bind(target)
}

function resolvePlugin (name, prefix, dir) {
  const prefixedName = `${prefix}${name}`
  let plugin
  [
    path.resolve(dir, name),
    path.resolve(dir, prefixedName),
    name,
    prefixedName
  ].find(moduleName => {
    try {
      plugin = require(moduleName)
      return plugin
    } catch (error) {
      // not found
    }
  })
  return plugin
}
