import PluginHost from '../src/plugin-host'

const test = require('ava')

test('async: can load Plugins', async t => {
  const multiplicand = 5
  const factor = 2
  const host = new PluginHost()
  let result
  host.use((challenge) => {
    result = challenge * factor
  })
  await host.run(multiplicand)
  t.is(result, multiplicand * factor)
})

test('sync: can load Plugins', t => {
  const multiplicand = 5
  const factor = 2
  const pluginHost = new PluginHost()
  let result
  pluginHost.use((challenge) => { result = challenge * factor })
  pluginHost.runSync(multiplicand)
  t.is(result, multiplicand * factor)
})

test('using options', async t => {
  const FACTOR = 2
  const NUM = 100

  const host = new PluginHost({
    dir: './test/fixtures/plugins/'
  })

  await host.use({
    multiply: 2
  })

  const options = { input: NUM }
  await host.run(options)
  t.is(options.result, FACTOR * NUM)
})
