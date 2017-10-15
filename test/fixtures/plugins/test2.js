module.exports = function TestPlugin (options) {
  options.array.push(2)
  return function testPlugin () {
    return options
  }
}
