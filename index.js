const path = require('path')

module.exports = function usePlugins (plugins, options) {
  options = Object.assign({
    use: undefined,
    errors: console.error.bind(console),
    modulePrefix: 'plugin-',
    baseDir: './plugins'
  }, options)

  const logError = functionForTarget(options.errors)
  const use = functionForTarget(options.use)
  if (!(use instanceof Function)) {
    throw new TypeError('Expected `options.use` to be a function, Array, logger, but got ' + typeof options.use)
  }

  return Object.entries(plugins)
    .filter(([name, pluginOptions]) => pluginOptions !== false)
    .map(([name, pluginOptions]) => {
      try {
        const plugin = resolvePlugin(name, options.modulePrefix, options.baseDir)
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
          plugins[name] = await pluginOptions === true
            ? plugin()
            : plugin(pluginOptions)
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
        .forEach(plugin => use(plugin))
      return plugins
    })
}

function functionForTarget (target) {
  // swallow
  if (target == null) return function () {}

  // call a function
  if (target instanceof Function) return target

  // Push to an array
  if (Array.isArray(target)) return Array.prototype.push.bind(target)

  // Use a logger
  if (target.error instanceof Function) return target.error.bind(target.error)
}

function resolvePlugin (name, modulePrefix, baseDir) {
  const prefixedName = `${modulePrefix}${name}`
  let plugin
  const imports = [
    path.resolve(baseDir, name),
    path.resolve(baseDir, prefixedName),
    name,
    prefixedName
  ].map(moduleName => {
    if (plugin) return
    try {
      plugin = require(moduleName)
    } catch (error) {
      // not found
    }
    return plugin
  }).filter(plugin => !!plugin)
  return imports.length
    ? imports[0]
    : undefined
}
