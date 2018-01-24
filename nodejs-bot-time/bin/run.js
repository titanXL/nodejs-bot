process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const service = require('../server/service.js')
const http = require('http')
const request = require('superagent')
const config = require('../config')
const logger = require('../config').log()
const server = http.createServer(service)
server.listen()

server.on('listening', () => {
  logger.info(
    `SKYNET-TIME IS LISTENING ON ${server.address().port} in ${service.get(
      'env'
    )} mode.`
  )

  const announce = () => {
    request.put(
      `http://127.0.0.1:3000/service/time/${server.address().port}`)
      .set('X-IRIS-SERVICE-TOKEN', config.serviceAccessToken)
      .set('X-IRIS-API-TOKEN', config.irisApiToken)
      .end(
        (err, response) => {
          if (err) {
            logger.info(err)
            logger.info('Error connecting to bot')
            return
          }
          logger.info(response.body)
        }
      )
  }
  announce()
  setInterval(announce, 15 * 1000)
})
