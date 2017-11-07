require('dotenv').config()
const bunyan = require('bunyan')

const logger = {
  development: () => {
    return bunyan.createLogger({name: 'NODEJS-BOT-TIME-DEV', level: 'debug'})
  },
  production: () => {
    return bunyan.createLogger({name: 'NODEJS-BOT-TIME-PROD', level: 'info'})
  },
  test: () => {
    return bunyan.createLogger({name: 'NODEJS-BOT-TIME-TEST', level: 'fatal'})
  }
}

module.exports = {
  googleTimeApiKey: process.env.GOOGLE_TIME_API_KEY,
  googleGeoApiKey: process.env.GOOGLE_GEO_API_KEY,
  log: env => {
    if(env)return logger[env]()

    return logger[process.env.NODE_ENV || 'development']()
  }
}