const test = require('ava')
const loadPlugins = require('../')

test('express: it can install express middleware', t => {
  const app = require('express')()
  return t.notThrows(() => {
    loadPlugins(app, {
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
    })
  })
})
