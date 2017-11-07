const should = require('should')

const ServiceRegistry = require('../../server/serviceRegistry')

describe('Service Registry', () => {
  describe('new', () => {
    it('should accept a timeout being passed in', () => {
      const serviceRegistry = new ServiceRegistry(60)
      serviceRegistry._timeout.should.equal(60)
    })
  })

  describe('add / get', () => {
    it('should add a new intent to the registry and provide it via get', () => {
      const serviceRegistry = new ServiceRegistry(60)
      serviceRegistry.add('test', '127.0.0.1', '9999')
      const testIntent = serviceRegistry.get('test')
      testIntent.intent.should.equal('test')
      testIntent.ip.should.equal('127.0.0.1')
      testIntent.port.should.equal('9999')
    })

    it('should update a service', () => {
      const serviceRegistry = new ServiceRegistry(60)
      serviceRegistry.add('test', '127.0.0.1', '9999')
      const testIntent1 = serviceRegistry.get('test')
      serviceRegistry.add('test', '127.0.0.1', '9999')
      const testIntent2 = serviceRegistry.get('test')

      Object.keys(serviceRegistry._services).length.should.equal(1)
      testIntent2.timestamp.should.be.greaterThanOrEqual(testIntent1.timestamp)
    })
  })

  describe('remove', () => {
    it('Should remove a service from the registry', () => {
      const serviceRegistry = new ServiceRegistry(60)
      serviceRegistry.add('test', '127.0.0.1', '9999')
      serviceRegistry.remove('test', '127.0.0.1', '9999')
      const testIntent = serviceRegistry.get('test')
      should.not.exist(testIntent)
    })
  })

  describe('_cleanup', () => {
    it('Should remove expired services', () => {
      const serviceRegistry = new ServiceRegistry(-1)
      serviceRegistry.add('test', '127.0.0.1', '9999')
      const testIntent = serviceRegistry.get('test')
      should.not.exist(testIntent)
    })
  })
})