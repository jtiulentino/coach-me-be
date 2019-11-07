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
                .get('/clientRoute/paginationGetMetrics')
                .set('Accept', 'application/json');
            expect(response.status).toBe(401);
        });

        it('should return 200 if a user has a valid token', async () => {
            const response = await request(server)
                .post('/clientRoute/login')
                .send({ clientPhone: '1111111111' })
                .set('Accept', 'application/json');
            //expect(response.text).toBe(200);
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
    describe('POST /coachRoute/newRegister', async () => {
        it('should return a 404 if you enter a name that is not in airtable', async () => {
            const response = await request(server)
                .post('/coachRoute/newRegister')
                .send({
                    name: 'mason karsevar',
                    email: 'masonkarsevar@gmail.com',
                    password: 'mkarse'
                })
                .set('Accept', 'application/json');
            expect(response.status).toBe(400);
        });
        it('should return a 200 if you enter a name that is apart of airtable', async () => {
            const response = await request(server)
                .post('/coachRoute/newRegister')
                .send({
                    name: 'Karin Underwood',
                    email: 'masonkarsevar@gmail.com',
                    password: 'mkarse'
                })
                .set('Accept', 'application/json');
            expect(response.status).toBe(200);
        });
    });
    describe('POST /coachRoute/login', async () => {
        it('should return a 200 if you enter a user that is registered', async () => {
            const response = await request(server)
                .post('/coachRoute/login')
                .send({
                    email: 'masonkarsevar@gmail.com',
                    password: 'mkarse'
                })
                .set('Accept', 'application/json');
            expect(response.status).toBe(200);
        });

        // will need to find a way to parse through the string to get the web token from the response.
        it('should return an array that contains a welcome message and webtoken', async () => {
            const response = await request(server)
                .post('/coachRoute/login')
                .send({
                    email: 'masonkarsevar@gmail.com',
                    password: 'mkarse'
                })
                .set('Accept', 'application/json');
            expect(response.text).toBe(/\"token\"/);
        });
    });

    describe('GET /coachRoute/getClientMetrics/:id', async () => {
        it('should return a 200 if you enter a valid patientId', async () => {
            const response = await request(server)
                .get('/coachRoute/getClientMetrics/rec3NQI2MqXCQNQX1')
                .set('Accept', 'application/json');
            expect(response.status).toBe(200);
        });
        it('should return an array of all the health metrics of a patient', async () => {
            const response = await request(server)
                .get('/coachRoute/getClientMetrics/rec3NQI2MqXCQNQX1')
                .set('Accept', 'application/json');
            expect(response.text).toBe(
                '{"patientMetrics":[{"clientId":"rec3NQI2MqXCQNQX1","date":"2019-10-10T01:02:00.000Z","Blood_pressure_over":154,"Blood_pressure_under":96,"Weight":212},{"clientId":"rec3NQI2MqXCQNQX1","date":"2019-10-03T00:51:00.000Z"},{"clientId":"rec3NQI2MqXCQNQX1","date":"2019-09-27T00:30:00.000Z","Blood_pressure_over":160,"Blood_pressure_under":90,"Weight":215},{"clientId":"rec3NQI2MqXCQNQX1","date":"2019-09-19T00:00:00.000Z","Weight":213}]}'
            );
        });
    });
    describe('GET /coachRoute/getClientGoals/:id', async () => {
        it('should return a 200 if you enter a valid patientId', async () => {
            const response = await request(server)
                .get('/coachRoute/getClientGoals/rec3NQI2MqXCQNQX1')
                .set('Accept', 'application/json');
            expect(response.status).toBe(200);
        });
        it('should return an array of all the health goals of a patient', async () => {
            const response = await request(server)
                .get('/coachRoute/getClientGoals/rec3NQI2MqXCQNQX1')
                .set('Accept', 'application/json');
            expect(response.text).toBe(
                '{"patientGoals":[{"clientId":"rec3NQI2MqXCQNQX1","goal":"Eating breakfast\\nDo squats","goalDetails":"Going on more walks; no details on stew\\n\\nNumbers not what she expectedDidn\'t get to exercise more than 2xs a week; high calorie tiramisu for birthday\\nGetting back on track - skipping a lot of things - don\'t miss it\\nClothes fitting better","startDate":"2019-10-10T01:02:00.000Z","metGoal":"Yes"},{"clientId":"rec3NQI2MqXCQNQX1","goal":"Look up good recipe for meatball vegetable stew, make one this week (baby loves).\\nWants to get a pedometer for her birthday.","goalDetails":"Starting doing planks! Figuring out the right shoes to help her tools.\\n\\nStarting to notice her waist has better definition. Getting smaller and smaller.\\nTrying hard to have greens with every meal.","startDate":"2019-10-03T00:51:00.000Z","metGoal":"Yes"},{"clientId":"rec3NQI2MqXCQNQX1","goal":"Limit the fried food; crunches and planks","goalDetails":"Yes! And had a really good workout","startDate":"2019-09-27T00:30:00.000Z","metGoal":"Yes"},{"clientId":"rec3NQI2MqXCQNQX1","goal":"-> Staying consistent with workouts - 3xs a week - 2 hours - high intensity AND -> Caring for food, not emotional eating, try not to eat when bored","goalDetails":"Hasn\'t been to the gym as much as she wants, though has money for it, wants pool","startDate":"2019-09-19T00:00:00.000Z","metGoal":"No"},{"clientId":"rec3NQI2MqXCQNQX1","startDate":"2019-09-01T22:00:00.000Z"},{"clientId":"rec3NQI2MqXCQNQX1"}]}'
            );
        });
    });
    // hello!!!
    describe('GET /coachRoute/getLastCheckinTime/:id', async () => {
        it('should return a 200 if you enter a valid patientId', async () => {
            const response = await request(server)
                .get('/coachRoute/getLastCheckinTime/rec3NQI2MqXCQNQX1')
                .set('Accept', 'application/json');
            expect(response.status).toBe(200);
        });
        it('should return an array of all the health goals of a patient', async () => {
            const response = await request(server)
                .get('/coachRoute/getLastCheckinTime/rec3NQI2MqXCQNQX1')
                .set('Accept', 'application/json');
            expect(response.text).toBe(
                '{"lastCheckin":26,"clientId":"rec3NQI2MqXCQNQX1"}'
            );
        });
    });
});
