const db = require('../../data/dbConfig.js');

module.exports = {
    insertNewCoach,
    insertNewUser,
    findCoachByPhone,
    findCoachByEmail,
    insertNewPatient,
    insertConversation,
    insertRecoveryPassword
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

function insertNewPatient(patientObject) {
    return db('patients').insert(patientObject, 'patientId');
}

function insertConversation(conversationObject) {
    return db('conversations').insert(conversationObject, 'id');
}

// forgot password model function (recoveries table):
function insertRecoveryPassword(passwordObject) {
    return db('recoveries').insert(passwordObject, 'id');
}
