const axios = require('axios');
const uuidv4 = require('uuid/v4');
const Airtable = require('airtable');

const coachDb = require('./twilioModel.js');

module.exports = {
    addToScheduledMessages,
    validateScheduledPost
};

function addToScheduledMessages(req, res, next) {
    // res.status(200).json({ body: req.body });

    coachDb
        .findSenderByPhone({ userPhone: req.body.numbers })
        .then(results => {
            coachDb
                .insertScheduledMessage({
                    scheduleId: uuidv4(),
                    patientId: results.patientId,
                    sec: req.body.sec,
                    min: req.body.min,
                    hour: req.body.hour,
                    dom: req.body.dom,
                    month: req.body.month,
                    weekday: req.body.weekday,
                    msg: req.body.msg
                })
                .then(results => {
                    next();
                })
                .catch(err => {
                    res.status(500).json({ error: err });
                });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

function validateScheduledPost(req, res, next) {
    const message = req.body;
    if (message.patientId && message.msg) {
        next();
    } else {
        res.status(401).json({
            message: 'Missing patientId or message in post request.'
        });
    }
}
