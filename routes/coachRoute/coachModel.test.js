const coachDb = require('./coachModel.js');
const db = require('../../data/dbConfig.js');

describe('coachModel.js helper functions', () => {
    afterAll(async () => {
        await db('users').truncate();
        await db('coaches').truncate();
    });

    describe('insert functionality for the users table', () => {
        it('should return the index id of newly created user', async () => {
            const result = await coachDb.insertNewUser({
                userId: '1',
                role: 'coach',
                userPhone: '(509) 720-4950'
            });
            expect(result[0]).toBe(1);
        });
        it('should store inserted data', async () => {
            const result = await db('users')
                .where({ userId: '1' })
                .first();
            expect(result).toEqual({
                role: 'coach',
                userId: '1',
                userPhone: '(509) 720-4950'
            });
        });
    });
    describe('find user by phone number functionality for users table', () => {
        it('should return an object of a validate userPhone', async () => {
            const result = await coachDb.findCoachByPhone({
                userPhone: '(509) 720-4950'
            });
            expect(result).toEqual({
                role: 'coach',
                userId: '1',
                userPhone: '(509) 720-4950'
            });
        });
    });
    describe('inserts preexisting user into coach table', () => {
        it('should return the index id of newly created coach', async () => {
            const result = await coachDb.insertNewCoach({
                userId: '1',
                coachId: '1',
                coachName: 'Karin Underwood',
                password: 'hello',
                email: 'wat11@gmail.com'
            });
            expect(result[0]).toBe(1);
        });
        it('should insert a specified data into the coaches table', async () => {
            const result = await db('coaches')
                .where({ coachId: '1' })
                .first();
            expect(result).toEqual({
                coachId: '1',
                coachName: 'Karin Underwood',
                email: 'wat11@gmail.com',
                password: 'hello',
                userId: '1'
            });
        });
    });
    describe('finds a valid coach by email', () => {
        it('should return the object of coach that is attached to the email', async () => {
            const result = await coachDb.findCoachByEmail({
                email: 'wat11@gmail.com'
            });
            expect(result).toEqual({
                coachId: '1',
                coachName: 'Karin Underwood',
                email: 'wat11@gmail.com',
                password: 'hello',
                userId: '1'
            });
        });
    });
    describe('inserts patient with a preexisting userId into patients table', () => {
        it('should return the index id of the newly inserted entry', async () => {
            const result = await coachDb.insertNewPatient({
                userId: '1',
                patientId: '1',
                patientName: 'Karin Underwood',
                coachId: '1'
            });
            expect(result[0]).toBe(1);
        });
        it('should store newly inserted patient information in the patients table', async () => {
            const result = await db('patients')
                .where({ patientId: '1' })
                .first();
            expect(result).toEqual({
                coachId: '1',
                patientId: '1',
                patientName: 'Karin Underwood',
                userId: '1'
            });
        });
    });
});
