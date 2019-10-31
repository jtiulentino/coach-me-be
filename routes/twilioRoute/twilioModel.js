const db = require('../../data/dbConfig.js');

module.exports = {
    findSenderByPhone,
    patientInConversations,
    findCoachSenderById,
    createNewConversation,
    insertNewMessage
};

function findSenderByPhone(filter) {
    return db('users')
        .where(filter)
        .first();
}

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
