require('dotenv').config()
const bunyan = require('bunyan')

const logger = {
  development: () => {
    return bunyan.createLogger({name: 'NODEJS-BOT-WEATHER-DEV', level: 'debug'})
  },
  production: () => {
    return bunyan.createLogger({name: 'NODEJS-BOT-WEATHER-PROD', level: 'info'})
  },
  test: () => {
    return bunyan.createLogger({name: 'NODEJS-BOT-WEATHER-TEST', level: 'fatal'})
  }
}

module.exports = {
  log: env => {
    if(env)return logger[env]()

    return logger[process.env.NODE_ENV || 'development']()
  }
}