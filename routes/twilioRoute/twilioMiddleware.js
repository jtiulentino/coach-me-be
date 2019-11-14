const Airtable = require("airtable");
const twilioDb = require("./twilioModel.js");

module.exports = {
  validateScheduledPost
};

// validation middleware for the /twilioRoute/postScheduled and /twilioRoute/updateScheduled endpoints.
// checks if the request body contains a patientId and a message.
function validateScheduledPost(req, res, next) {
  const message = req.body;
  if (message.patientId && message.msg) {
    next();
  } else {
    res.status(401).json({
      message: "Missing patientId or message in post request."
    });
  }
}
