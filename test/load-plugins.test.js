const test = require('ava')
const sinon = require('sinon')
const usePlugins = require('../')

test('does not `use` disabled plugins', async t => {
  const options = {
    target: sinon.spy()
  }
  await usePlugins({
    test: false
  }, options)
  t.true(options.target.notCalled)
})

test('does `use` enabled plugins', async t => {
  const options = {
    target: sinon.spy(),
    dir: './test/fixtures/plugins/'
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
  t.true(options.target.calledTwice, 'calls target.use()')
})

// eslint-disable-next-line no-array-constructor
Array('hello', {}, 1).forEach(target => {
  test(`throws when passing a ${typeof target} for 'target'`, t => {
    return t.throws(() => usePlugins({}, { target }))
  })
})

test('calls plugin without parameters if options === `true`', async t => {
  const plugins = {
    'no-args': true
  }
  const options = {
    target: sinon.spy(),
    dir: './test/fixtures/plugins/'
  }

  await usePlugins(plugins, options)
  t.true(options.target.called)
})

test('`loadPlugins(target, plugins, options)`', async t => {
  const plugins = {
    'no-args': true
  }

  const targetObject = {
    use: sinon.spy()
  }

  const options = {
    dir: './test/fixtures/plugins/'
  }

  await usePlugins(targetObject, plugins, options)
  t.true(targetObject.use.called)
})

test('throws if both `target` and `options.target` are specified', async t => {
  const targetArgument = sinon.spy()
  const options = {
    target: sinon.spy()
  }
  const plugins = {}
  await t.throws(() => {
    return usePlugins(targetArgument, plugins, options)
  })
  t.true(options.target.notCalled)
  t.true(targetArgument.notCalled)
})
