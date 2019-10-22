const db = require('../data/dbConfig.js');

module.exports = {
    findPatientByPhone,
    updateLoginTime
};

// filter by clientPhone using the phoneNumber key in the patient-login db
function findPatientByPhone(filter) {
    return db('patient-login').where(filter);
}


function updateLoginTime(filter, changes) {
    return db('patient-login')
        .where(filter)
        .update(changes, 'id');
}
