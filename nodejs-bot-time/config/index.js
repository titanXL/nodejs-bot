require('dotenv').config()
const logger = require('../../utils/logger')

const serviceAccessToken = require('crypto').randomBytes(16).toString('hex').slice(0, 32)

module.exports = {
  googleTimeApiKey: process.env.GOOGLE_TIME_API_KEY,
  googleGeoApiKey: process.env.GOOGLE_GEO_API_KEY,
  irisApiToken: process.env.IRIS_API_TOKEN,
  serviceAccessToken: serviceAccessToken,
  log: env => {
    if(env)return logger[env]()

    return logger[process.env.NODE_ENV || 'development']()
  }
}
