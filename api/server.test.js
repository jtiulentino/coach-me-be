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

    describe('POST /login', async () => {
        it('should return 200', () => {
            request(server)
                .post('/clientRoute/login')
                .send({ clientPhone: '1111111111' })
                .set('Accept', 'application/json')
                // .set(requestOptions)
                .then(res => {
                    expect(res.status).toBe(200);
                });
        });
    });

    describe('GET /paginationGetMetrics', async () => {
        it('should return 404 if a user tries to hit endpoint without a webtoken', async () => {
            const response = await request(server)
                .get('clientRoute/getMetrics')
                .set('Accept', 'application/json');
            expect(response).toBe('hello');
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

    describe('/coachRoute endpoints', () => {
        describe('POST /coachRoute/newRegister', async () => {
            it('should return a 404 if you enter a name that is not in airtable', () => {
                request(server)
                    .post('/coachRoute/newRegister')
                    .send({
                        name: 'mason karsevar',
                        email: 'masonkarsevar@gmail.com',
                        password: 'mkarse79'
                    })
                    .then(result => {
                        expect(result.status).toBe(200);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        });
    });
});
