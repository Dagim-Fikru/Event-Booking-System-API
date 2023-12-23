const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');// import your express app
const bookingModel = require('../api/models/booking');
const booking = require('../api/routes/bookings');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Bookings API', () => {
    it('should POST a new booking', done => {
        const newBooking = {
            event: 'eventId',
            booking_date: '2022-01-01',
            status: 'confirmed'
        };

        chai.request(app)
            .post('/bookings')
            .send(newBooking)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').eql('Event Booked successfully!');
                done();
            });
    });

    // Add more tests for other endpoints...
});
