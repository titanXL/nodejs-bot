class ServiceRegistry {
  constructor(config) {
    this._services = []
    this._timeout = config.timeout
    this._logger = config.log()
  }

  add(intent, ip, port, accessToken) {
    const key = intent + ip + port + accessToken
    if (!this._services[key]) {
      this._services[key] = {}
      this._services[key].timestamp = Math.floor(new Date() / 1000)
      this._services[key].ip = ip
      this._services[key].port = port
      this._services[key].intent = intent
      this._services[key].accessToken = accessToken

      this._logger.info(`Added service for intent: ${intent} on ${ip}:${port}`)
      this._cleanUp()
      return
    }

    this._services[key].timestamp = Math.floor(new Date() / 1000)
    this._logger.info(`Updated service for intent: ${intent} on ${ip}:${port}`)
    this._cleanUp()
  }

  remove(intent, ip, port, accessToken) {
    const key = intent + ip + port + accessToken
    delete this._services[key]
  }

  get(intent) {
    this._cleanUp()
    for (let key in this._services) {
      if (this._services[key].intent == intent) {
        return this._services[key]
      }
    }
    return null
  }

  _cleanUp() {
    const timeNow = Math.floor(new Date() / 1000)
    for (let key in this._services) {
      if (this._services[key].timestamp + this._timeout < timeNow) {
        this._logger.info(
          `Removed service for intent ${this._services[key].intent}`
        )
        delete this._services[key]
      }
    }
  }
}

module.exports = ServiceRegistry
