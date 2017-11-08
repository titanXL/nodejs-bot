require('should')
const request = require('supertest')
const service = require('../../server/service')
const config = require('../../config')

describe('The express service', () => {
  describe('GET /foo', () => {
    it('should return HTTP 404', (done) => {
      request(service)
        .get('/foo')
        .expect(404, done)
    })
  })

  describe('GET /service/:location', () => {
    it('should return HTTP 200 and a replay with a valid result', (done) => {
      request(service)
        .get('/service/sofia')
        .set('X-IRIS-SERVICE-TOKEN', config.serviceAccessToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.body.result.should.exist
          return done()
        })
    })
    it('should return HTTP 403 if no valid token was passed', (done) => {
      request(service)
        .get('/service/sofia')
        .set('X-IRIS-SERVICE-TOKEN', 'test')
        .expect(403)
        .end(done)
    })
  })
})
