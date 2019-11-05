const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');
const Clients = require('../routes/clientModel');
const axios = require('axios');

describe('server', () => {
    beforeEach(async () => {
        await db('patient-login').truncate();
    });
    it('Should be testing environment', () => {
        expect(process.env.DB_ENV).toBe('testing');
    });

    // const requestOptions = {
    //     headers: {
    //         accept: 'application/json',
    //         Authorization: `Bearer ${process.env.AIRTABLE_KEY}`
    //     }
    // };

    describe('POST /login', () => {
        it('should return 200', () => {
            return (
                request(server)
                    .post('/clientRoute/login')
                    .send({ phoneNumber: '1111111111' })
                    // .set(requestOptions)
                    .then(res => {
                        expect(res.status).toBe(200);
                        expect(res.body.phoneNumber).toBe('1111111111');
                    })
            );
        });
    });

    let token;

    describe('GET /getIntakeRecords', async () => {
        it('should return 200 ok using async/await', async () => {
            const res = await request(server).get('/getIntakeRecords');
            // set(requestOptions)
            expect(res.status).toBe(200);
        });

        it('should return JSON', done => {
            request(server)
                .get('/getIntakeRecords')
                .then(res => {
                    expect(res.type).toMatch(/json/i);
                    done();
                });
        });
    });
});
