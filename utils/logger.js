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

module.exports = logger
