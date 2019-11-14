const db = require("../../data/dbConfig.js");

module.exports = {
  insertNewCoach,
  insertNewUser,
  findCoachByPhone,
  findCoachByEmail,
  insertNewPatient,
  insertConversation,
  insertRecoveryPassword,
  findCoachByToken,
  findCoachByEmailJoin,
  updateCoachRecord,
  deleteRecoveryInstance
};

function findCoachByPhone(filter) {
  return db("users")
    .where(filter)
    .first();
}

function insertNewUser(userObject) {
  return db("users").insert(userObject);
}

function insertNewCoach(coachObject) {
  return db("coaches").insert(coachObject);
}

function findCoachByEmail(filter) {
  return db("coaches")
    .where(filter)
    .first();
}

function insertNewPatient(patientObject) {
  return db("patients").insert(patientObject);
}

// Accompanying helper function with /coachRoute/makeConversation route. This function
// is most likely redundant since message history is built into the twilio messaging library.
function insertConversation(conversationObject) {
  return db("conversations").insert(conversationObject);
}

// forgot password model function (/forgotRoute/forgotPassword):
function insertRecoveryPassword(passwordObject) {
  return db("recoveries").insert(passwordObject);
}

// forgot password model function (/resetRoute/reset)
function findCoachByToken(passwordObject) {
  return db("recoveries")
    .join("coaches", "coaches.coachId", "recoveries.coachId")
    .where(passwordObject)
    .first();
}

// update password model function (/updatePasswordRoute/updatePasswordViaEmail)
function findCoachByEmailJoin(coachObject) {
  return db("coaches")
    .join("recoveries", "recoveries.coachId", "coaches.coachId")
    .where(coachObject)
    .first();
}

function updateCoachRecord(coachObject, updateCoach) {
  return db("coaches")
    .where(coachObject)
    .update(updateCoach);
}

function deleteRecoveryInstance(recoveryObject) {
  return db("recoveries")
    .where(recoveryObject)
    .del();
}
