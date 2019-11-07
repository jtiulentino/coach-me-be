const twilioDb = require('./twilioModel.js');
const coachDb = require('../coachRoute/coachModel.js');
const db = require('../../data/dbConfig.js');
// hello
describe('twilioModel.js helper functions', () => {
    afterAll(async () => {
        await db('users').truncate();
        await db('coaches').truncate();
        await db('patients').truncate();
        await db('scheduledMessages').truncate();
    });

    describe('insertScheduledMessage tests', () => {
        it('should create a new record within scheduledMessages table', async () => {
            await coachDb.insertNewUser({
                userId: '1',
                role: 'coach',
                userPhone: '(509) 720-4950'
            });
            await coachDb.insertNewUser({
                userId: '2',
                role: 'patient',
                userPhone: '(509) 720-4951'
            });
            await coachDb.insertNewCoach({
                coachId: '1',
                coachName: 'Karin Underwood',
                email: 'wat11@gmail.com',
                password: 'hello',
                userId: '1'
            });
            await coachDb.insertNewPatient({
                userId: '2',
                patientId: '1',
                patientName: 'Mason Karsevar',
                coachId: '1'
            });

            const response = await twilioDb.insertScheduledMessage({
                scheduleId: '1',
                patientId: '1',
                sec: 1,
                min: 12,
                hour: 2,
                dom: '',
                month: '',
                weekday: '',
                msg: 'hello there!!!'
            });

            expect(response[0]).toBe(1);
        });
        it('should store newly inserted object in scheduledMessages table', async () => {
            const response = await db('scheduledMessages')
                .where({ scheduleId: '1' })
                .first();
            expect(response).toEqual({
                dom: '',
                hour: 2,
                min: 12,
                month: '',
                msg: 'hello there!!!',
                patientId: '1',
                scheduleId: '1',
                sec: 1,
                weekday: ''
            });
        });
    });
    describe('updateScheduled function', () => {
        it('should update a record in scheduledMessages table with preexisting scheduleId', async () => {
            await twilioDb.updateScheduled(
                { scheduleId: '1' },
                {
                    dom: '',
                    hour: 2,
                    min: 12,
                    month: '',
                    msg: 'hello there!!! me too',
                    patientId: '1',
                    scheduleId: '1',
                    sec: 1,
                    weekday: ''
                }
            );

            const response = await db('scheduledMessages')
                .where({ scheduleId: '1' })
                .first();
            expect(response).toEqual({
                dom: '',
                hour: 2,
                min: 12,
                month: '',
                msg: 'hello there!!! me too',
                patientId: '1',
                scheduleId: '1',
                sec: 1,
                weekday: ''
            });
        });
    });
    describe('getScheduledByPatientId function', () => {
        it('should return all scheduled messages for a specific patient', async () => {
            const response = await twilioDb.getScheduledByPatientId({
                patientId: '1'
            });
            expect(response).toEqual([
                {
                    dom: '',
                    hour: 2,
                    min: 12,
                    month: '',
                    msg: 'hello there!!! me too',
                    patientId: '1',
                    scheduleId: '1',
                    sec: 1,
                    weekday: ''
                }
            ]);
        });
    });
    describe('deleteScheduled function', () => {
        it('should delete a record in scheduledMessages table with a preexisting scheduleId', async () => {
            await twilioDb.deleteScheduled({ scheduleId: '1' });
            const response = await db('scheduledMessages').where({
                scheduleId: '1'
            });
            expect(response).toEqual([]);
        });
    });
});
