const axios = require('axios');
const uuidv4 = require('uuid/v4');
const Airtable = require('airtable');

const coachDb = require('./twilioModel.js');

module.exports = {
    addToScheduledMessages
};

function addToScheduledMessages(req, res, next) {
    res.status(200).json({ body: req.body });
}
