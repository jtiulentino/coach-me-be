const axios = require("axios");
const uuidv4 = require("uuid/v4");
const Airtable = require("airtable");

const coachDb = require("./twilioModel.js");

module.exports = {
  validateScheduledPost
};

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
