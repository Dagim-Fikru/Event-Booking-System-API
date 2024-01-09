const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const app = require('../app');

const booking = require('../api/routes/bookings');

chai.should();

chai.use(chaiHttp);

describe('Booking API', () => {
    // Test the GET route
    describe('GET /bookings', () => {
        it('It should GET all the bookings', (done) => {
            chai.request(server)
                .get('/bookings')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.length.should.be.eq(2);

                done();
                });
        });
    });
});