const express = require('express');
const uuidv4 = require('uuid/v4');

// Will need to install authentication for all the endpoints in
// the /twilioRoute/
const {
    generateToken,
    authenticateToken
} = require('../coachRoute/coachAuth.js');

const {
    validateScheduledPost,
    authenticateServer
} = require('./twilioMiddleware.js');

const twilioDb = require('./twilioModel.js');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const router = express.Router();

// sends sms message through twilio.
router.post('/twilio', (req, res) => {
    // reformats the phone number from the request body from (509) 789-9090 to 5097899090
    // Phone numbers in the airtable are stored as (509) 789-9090
    console.log("Posting")
    console.log(req.body)
    let cleanedNumber = ('' + req.body.Phone).replace(/\D/g, '');
    console.log(cleanedNumber)
    // twilio messaging client function. Accepts a from phone number
    // (needs to be a twilio number purchased from the twilio site),
    // a to phone number (will need to be validated if using trial account),
    // and a message in the body.
    client.messages
        .create({
            body: `${req.body.message}`,
            from: `${process.env.TWILIO_NUMBER}`,
            to: `+1${cleanedNumber}`
        })

        // Returns the messages special id if the function is successful.
        .then(message => res.status(201).json(message.sid))
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// Uses the twilio message history async function to get back the entire message history
// of a specific twilio number.
router.get('/messagehistory/:phone', (req, res) => {
    // format phone number from (509) 780-9090 to 5097809090.
    let cleanedPhone = ('' + req.params.phone).replace(/\D/g, '');
    client.messages

        .list({ limit: 9000 })

        .then(messages => {
            // filters the twilio message history by the phone number in req.params
            // Want to receive back inbound and outbound.
            const filteredMessages = messages.reverse().map(message => {
                if (
                    message.to === `+1${cleanedPhone}` ||
                    message.from === `+1${cleanedPhone}`
                ) {
                    return message;
                }
            });

            // filters out possible null values (safety feature for imperfect data)
            const filteredNulls = filteredMessages.filter(
                message => message != undefined
            );
            res.status(200).json({
                message: filteredNulls
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// Scheduling crude functionality:

// Inserts scheduled message to the scheduledMessages table in database.
router.post('/postScheduled', validateScheduledPost, (req, res) => {
    req.body.scheduleId = uuidv4();

    twilioDb
        .insertScheduledMessage(req.body)
        .then(results => {
            res.status(201).json({
                message: `new scheduled message has been inserted for patientId ${req.body.patientId}`
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// returns back an array of all scheduled messages for a specific patientId (patientId are
// from the airtable)
router.get('/getScheduled/:id', (req, res) => {
    twilioDb
        .getScheduledByPatientId({ patientId: req.params.id })
        .then(results => {
            res.status(200).json({ data: results });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// deletes a specific scheduled message from the scheduledMessages table using the
// scheduleId primary key. scheduleIds are created using uuidv4 function.
router.delete('/deleteScheduled/:id', (req, res) => {
    twilioDb
        .deleteScheduled({ scheduleId: req.params.id })
        .then(results => {
            if (results) {
                res.status(200).json({
                    message: `scheduled message scheduleId ${req.params.id} has been deleted.`
                });
            } else {
                res.status(404).json({
                    message: `scheduled message scheduleId ${req.params.id} can not be found.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'unable to delete entry' });
        });
});

// updates a specific scheduled message in the scheduledMessages table using the
// scheduleId primary key. patientId and msg are required for this command to be successful.
router.put('/updateScheduled/:id', validateScheduledPost, (req, res) => {
    twilioDb
        .updateScheduled({ scheduleId: req.params.id }, req.body)
        .then(results => {
            if (results) {
                res.status(200).json({
                    message: `scheduleId ${req.params.id} has been updated.`
                });
            } else {
                res.status(404).json({
                    message: `unable to find scheduleId ${req.params.id} in database.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// get request for the cron message scheduling server. Returns all of the
// scheduled messages from the scheduledMessages table.
router.get('/getAllScheduledMessages', (req, res) => {
    twilioDb
        .getAllScheduled()
        .then(results => {
            res.status(200).json({
                message: 'receiving all messages from messageHistory table.',
                data: results
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;

// Nick's number:
// +12513877822

// Isaiah's number:
// +12055123191

// {
// 	"patientId": "recmLlbDsUaCMUFhf",
//     "msg": "hello mason good morning!",
//     "min": "07",
//     "hour": "8",
//     "weekday": "Tuesday"
// }
