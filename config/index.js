require('dotenv').config()

const bunyan = require('bunyan')

const logger = {
  development: () => {
    return bunyan.createLogger({name: 'NODEJS-BOT-DEV', level: 'debug'})
  },
  production: () => {
    return bunyan.createLogger({name: 'NODEJS-BOT-PROD', level: 'info'})
  },
  test: () => {
    return bunyan.createLogger({name: 'NODEJS-BOT-TEST', level: 'fatal'})
  }
}

module.exports = {
  witToken: process.env.WIT_TOKEN,
  timeout: 60,
  irisApiToken: process.env.IRIS_API_TOKEN,
  log: env => {
    if(env)return logger[env]()

    return logger[process.env.NODE_ENV || 'development']()
  }
}