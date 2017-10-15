const test = require('ava')
const sinon = require('sinon')
const usePlugins = require('../')

test('does not `use` disabled plugins', async t => {
  const options = {
    use: sinon.spy()
  }
  await usePlugins({
    test: false
  }, options)
  t.true(options.use.notCalled)
})

test('does `use` enabled plugins', async t => {
  const options = {
    use: sinon.spy(),
    baseDir: './test/fixtures/plugins/'
  }
  const pluginOptions = {
    pluginInitialized: false
  }
  await usePlugins({
    './test': pluginOptions,
    './test2': pluginOptions
  }, options)
  t.true(pluginOptions.pluginInitialized, 'initializes plugins')
  t.deepEqual(pluginOptions.array, [1, 2], 'inintalizes plugins in the order specified')
  t.true(options.use.calledTwice, 'calls target.use()')
})

// eslint-disable-next-line no-array-constructor
Array('hello', {}, 1).forEach(use => {
  test(`throws when passing a ${typeof use} for 'use'`, t => {
    return t.throws(() => usePlugins({}, { use }))
  })
})

test('calls plugin without parameters if options === `true`', t => {
  const plugins = {
    'no-args': true
  }
  const options = {
    use: sinon.spy(),
    baseDir: './test/fixtures/plugins/'
  }
  return t.notThrows(() => usePlugins(plugins, options))
})
