const db = require('../../data/dbConfig.js');

module.exports = {
    insertNewCoach,
    insertNewUser,
    findCoachByPhone,
    findCoachByEmail
};

function findCoachByPhone(filter) {
    return db('users')
        .where(filter)
        .first();
}

function insertNewUser(userObject) {
    return db('users').insert(userObject, 'userId');
}

function insertNewCoach(coachObject) {
    return db('coaches').insert(coachObject, 'coachId');
}

function findCoachByEmail(filter) {
    return db('coaches')
        .where(filter)
        .first();
}
