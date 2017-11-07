const should = require('should')
const request = require('supertest')
const service = require('../../server/service')

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
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err)
                    res.body.result.should.exist
                    return done()
                })
        })
    })
})
