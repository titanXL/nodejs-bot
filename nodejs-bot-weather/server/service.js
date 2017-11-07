const express = require('express')
const service = express()
const request = require('superagent')
const logger = require('../config').log()

service.get('/service/:location', (req, res) => {
  request.get(
    'http://api.openweathermap.org/data/2.5/weather?q=' +
    req.params.location +
    '&APPID=71965510521fcc10776e6f77e12f9df4',
    (err, response) => {
      if (err) {
        logger.info(err)
        return res.sendStatus(404)
      }
      res.json({
        result: `${response.body.weather[0].description} at ${response
          .body.main.temp - 273.15} degrees`
      })
    }
  )
})
module.exports = service
