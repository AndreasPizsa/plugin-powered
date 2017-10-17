const usePlugins = require('../')

module.exports = class PluginHost {
  constructor (options) {
    this.options = Object.assign({}, options)
    this.options.target = this
    this.plugins = []
  }

  use (pluginOrPluginConfig) {
    if (pluginOrPluginConfig instanceof Function) {
      this.plugins.push(pluginOrPluginConfig)
      return this
    }

    return usePlugins(pluginOrPluginConfig, this.options)
  }

  run (...args) {
    return PluginHost.run.call(this.options.host, this.plugins, ...args)
  }

  runSync (...args) {
    PluginHost.runSync.call(this.options.host, this.plugins, ...args)
  }

  static runSync (plugins, ...args) {
    plugins.forEach((plugin) => plugin.apply(null, args))
  }

  static run (plugins, ...args) {
    return plugins.reduce((promise, plugin) => {
      return promise.then(() => plugin.apply(this, args))
    }, Promise.resolve())
  }
}
