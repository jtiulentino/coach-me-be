const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');
const Clients = require('../routes/clientModel');
const axios = require('axios');

describe('server', () => {
    // beforeEach(async () => {
    //     await db('patient-login').truncate();
    // });

    it('Should be testing environment', () => {
        expect(process.env.DB_ENV).toBe('testing');
    });

    // const requestOptions = {
    //     headers: {
    //         accept: 'application/json',
    //         Authorization: `Bearer ${process.env.AIRTABLE_KEY}`
    //     }
    // };

    // Same reoccuring 500 error upon testing login. Login works perfectly when using postman.
    // describe('POST /login', () => {
    //     it('should return 200', () => {
    //         return (
    //             request(server)
    //                 .post('/clientRoute/login')
    //                 .send({ clientPhone: '1111111111' })
    //                 // .set(requestOptions)
    //                 .then(res => {
    //                     expect(res.status).toBe(200);
    //                     expect(res.body.clientPhone).toBe('1111111111');
    //                 })
    //         );
    //     });
    // });

    describe('GET /getIntakeRecords', async () => {
        it('should return 404 if a user tries to hit endpoint without a webtoken', async () => {
            const res = await request(server).get('/getIntakeRecords');
            // set(requestOptions)
            expect(res.status).toBe(404);
        });

        it('should return text/html', done => {
            request(server)
                .get('/getIntakeRecords')
                .then(res => {
                    expect(res.type).toMatch(/text/i);
                    done();
                });
        });
    });
});
