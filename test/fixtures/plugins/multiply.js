module.exports = function Multiply (factor) {
  return function multiply (params) {
    params.result = params.input * factor
  }
}
