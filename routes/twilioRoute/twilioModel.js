const db = require('../../data/dbConfig.js');

module.exports = {
    findSenderByPhone,
    patientInConversations,
    findCoachSenderById,
    createNewConversation,
    insertNewMessage,
    insertScheduledMessage,
    getScheduledByPatientId
};

function findSenderByPhone(filter) {
    return db('users')
        .join('patients', 'patients.userId', 'users.userId')
        .where(filter)
        .select('patients.patientId')
        .first();
}

// database functions for updating messageHistory and conversations (most likely won't be used)
function patientInConversations(filter) {
    return db('conversations')
        .where(filter)
        .first();
}

function findCoachSenderById(filter) {
    return db('coaches')
        .where(filter)
        .first();
}

function createNewConversation(conversationObject) {
    return db('conversations').insert(conversationObject, 'conversationId');
}

function insertNewMessage(messageObject) {
    return db('messageHistory').insert(messageObject, 'messageId');
}

// database functions for scheduling messages.
function insertScheduledMessage(messageObject) {
    return db('scheduledMessages').insert(messageObject, 'scheduleId');
}

function getScheduledByPatientId(filter) {
    return db('scheduledMessages').where(filter);
}
