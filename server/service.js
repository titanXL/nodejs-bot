const express = require('express')
const service = express()

const ServiceRegistry = require('./serviceRegistry.js')


module.exports = config => {
  const serviceRegistry = new ServiceRegistry(config.serviceTimeout)
  service.set('serviceRegistry', serviceRegistry)

  service.put('/service/:intent/:port', (req, res) => {
    const serviceIntent = req.params.intent
    const servicePort = req.params.port

    const serviceIp = req.connection.remoteAddress.includes('::')
      ? `[${req.connection.remoteAddress}]`
      : req.connection.remoteAddress

    serviceRegistry.add(serviceIntent, serviceIp, servicePort)
    res.json({result: `${serviceIntent} at ${serviceIp}:${servicePort}`})
  })
  return service
}
