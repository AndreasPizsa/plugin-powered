const test = require('ava')
const usePlugins = require('../')

test('express: it can install express middleware', t => {
  const app = require('express')()
  usePlugins({
    cors: {
      origin: 'http://example.com',
      optionsSuccessStatus: 200
    },
    'express-session': {
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: true
      }
    }
  }, {
    use:app.use.bind(app)
  })
  t.pass()
})
