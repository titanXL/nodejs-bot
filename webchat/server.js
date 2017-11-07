module.exports = (serviceRegistry, config) => {
  const http = require('http')
  const logger = config.log()
  const service = require('../server/service.js')
  const server = http.createServer(service)
  server.listen(1337)

  const witToken = config.witToken
  const WitClient = require('../server/witClient.js')
  const witClient = new WitClient(witToken)
  var connections = []
  var users = []

  io = require('socket.io').listen(server) // eslint-disable-line

  io.sockets.on('connection', function (socket) { // eslint-disable-line
    socket.once('disconnect', function () {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id == this.id) {
          users.splice(i, 1)
        }
      }
      connections.splice(connections.indexOf(socket), 1)
      socket.disconnect()
      logger.info(
        'Disconnected : %s sockets connected',
        connections.length
      )
      io.emit('disconnect', users) // eslint-disable-line
    })

    socket.on('messageAdded', function (payload) {
      var newMessage = {
        timeStamp: payload.timeStamp,
        text: payload.text,
        user: payload.user
      }

      if (payload.text.toLowerCase().includes('skynet')) {
        witClient.ask(payload.text, (err, res) => {
          if (err) {
            logger.info(err)
            return
          }

          try {
            if (
              !res.intent ||
              !res.intent[0] ||
              !res.intent[0].value
            ) {
              throw new Error('Could not extract intent')
            }

            const intent = require('../server/intents/' +
              res.intent[0].value +
              'Intent')

            intent.process(res, serviceRegistry, logger, function (err, response) {
              if (err) {
                logger.info(err)
                logger.info(response)
                return
              }

              return io.emit('messageAdded', { // eslint-disable-line
                timeStamp: payload.timeStamp,
                text: response,
                user: 'skynet'
              })
            })
          } catch (err) {
            logger.info('HERE')

            logger.info(err)
            logger.info(res)
            return io.emit('messageAdded', 'Something happend...') // eslint-disable-line
          }
        })
      }
      io.emit('messageAdded', newMessage) // eslint-disable-line
    })

    socket.on('userJoined', function (payload) {
      var newUser = {
        id: this.id,
        name: payload.name
      }

      users.push(newUser)

      io.emit('userJoined', users) // eslint-disable-line
      logger.info('User joined:' + payload.name)
    })

    connections.push(socket)
    logger.info('Connected : %s sockets connected', connections.length)
  })
  logger.info('server is running on porn 1337')
}
