module.exports = function () {
  if (arguments.length) throw new Error('Requires 0 arguments')
  return function () { }
}
