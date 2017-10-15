module.exports = function TestPlugin (options) {
  options.pluginInitialized = true
  options.array = [ 1 ]
  return function testPlugin () {
    return options
  }
}
