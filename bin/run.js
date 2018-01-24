process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const http = require('http')
const config = require('../config')
const logger = config.log()

const service = require('../server/service.js')(config)
const server = http.createServer(service)

const serviceRegistry = service.get('serviceRegistry')

server.listen(3000)
server.on('listening', () => {
  logger.info(
    `SKYNET IS LISTENING ON ${server.address().port} in ${service.get(
      'env'
    )} mode.`
  )
})

require('../webchat/server.js')(serviceRegistry, config)
