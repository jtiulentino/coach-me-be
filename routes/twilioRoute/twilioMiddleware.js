const axios = require('axios');
const uuidv4 = require('uuid/v4');
const Airtable = require('airtable');

const coachDb = require('./twilioModel.js');

module.exports = {
    addToScheduledMessages
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
                    res.status(201).json({
                        message: `scheduled message added to database`
                    });
                })
                .catch(err => {
                    res.status(500).json({ error: err });
                });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}
