const test = require('ava')
const sinon = require('sinon')
const usePlugins = require('../')

test('logs an error if a plugin isn’t found', async t => {
  const options = {
    target: sinon.spy(),
    errors: sinon.spy()
  }
  await usePlugins(FIXTURES.plugins.nonexisting, options)
  t.true(options.errors.calledOnce)
})

test('logs an error if a plugin throws during initialization', async t => {
  const options = {
    target: sinon.spy(),
    errors: sinon.spy(),
    dir: './test/fixtures/plugins/'
  }
  await usePlugins({
    './throws': true
  }, options)
  t.true(options.errors.calledOnce)
})

test('continues `use`-ing after an errornous plugin', async t => {
  const options = {
    target: sinon.spy(),
    errors: sinon.spy(),
    dir: './test/fixtures/plugins/'
  }
  await usePlugins({
    './throws': true,
    './test': options,
    'nonexistingplugin': true,
    './test2': options
  }, options)

  t.true(options.pluginInitialized, 'initializes plugins')
  t.true(options.target.calledTwice, 'calls target.use()')
  t.deepEqual(options.array, [1, 2], 'inintalizes plugins in the order specified')
  t.true(options.errors.calledTwice)
})

test.serial('it logs to `console.error` if `errors` is not a property', async t => {
  const originalError = console.error
  console.error = function error () { error.called = true }
  await usePlugins(sinon.spy(), FIXTURES.plugins.nonexisting)
  t.true(console.error.called)
  console.error = originalError
})

test.serial('it swallows errors if `errors` is `undefined`', async t => {
  sinon.spy(console, 'error')
  await usePlugins(FIXTURES.plugins.nonexisting, {
    target: sinon.spy(),
    errors: null
  })
  t.false(console.error.called)
  console.error.restore()
})

test('it pushes to an array', async t => {
  const options = {
    target: sinon.spy(),
    errors: []
  }
  await usePlugins(FIXTURES.plugins.nonexisting, options)
  t.true(options.errors.length > 0)
  t.true(options.errors[0].name === 'nonexistingplugin')
  t.truthy(options.errors[0].error)
})

test('it calls a function', async t => {
  const options = {
    target: sinon.spy(),
    errors: sinon.spy()
  }
  await usePlugins(FIXTURES.plugins.nonexisting, options)
  t.true(options.errors.called)
})

test('it logs to a logger', async t => {
  const logger = {
    error: sinon.spy()
  }
  const options = {
    target: sinon.spy(),
    errors: logger
  }
  await usePlugins(FIXTURES.plugins.nonexisting, options)
  t.true(logger.error.called)
})

const FIXTURES = {
  plugins: {
    nonexisting: {
      nonexistingplugin: true
    }
  }
}
