const service = require('../server/service.js')
const http = require('http')
const request = require('superagent')
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
      `http://127.0.0.1:3000/service/time/${server.address().port}`,
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
