require('dotenv').config()
const logger = require('../utils/logger')

module.exports = {
  witToken: process.env.WIT_TOKEN,
  timeout: 60,
  irisApiToken: process.env.IRIS_API_TOKEN,
  log: env => {
    if(env)return logger[env]()

    return logger[process.env.NODE_ENV || 'development']()
  }
}
