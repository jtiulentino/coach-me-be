const express = require('express');
const axios = require('axios');
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const cron = require('node-cron');

const {
    generateToken,
    authenticateToken
} = require('../coachRoute/coachAuth.js');

const { addToScheduledMessages } = require('./twilioMiddleware.js');

const twilioDb = require('./twilioModel.js');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const router = express.Router();
//sends message through twilio
router.post('/twilio', (req, res) => {
    // res.status(200).json({ lookit: req.body });
    let cleanedNumber = ('' + req.body.Phone).replace(/\D/g, '');

    // res.status(200).json({ cleaned });

    client.messages
        .create({
            body: `${req.body.message}`,
            from: '+12513877822',
            to: `+1${cleanedNumber}`
        })

        .then(message => res.status(201).json(message.sid))
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.get('/messagehistory/:phone', (req, res) => {
    let cleanedPhone = ('' + req.params.phone).replace(/\D/g, '');
    client.messages

        .list({ limit: 9000 })

        .then(messages => {
            // const filteredMessagesTo = messages.filter(
            //     message => message.to === `+1${cleanedPhone}`
            // );
            // const filteredMessagesFrom = messages.filter(
            //     message => message.from === `+1${cleanedPhone}`
            // );

            const filteredMessages = messages.reverse().map(message => {
                if (
                    message.to === `+1${cleanedPhone}` ||
                    message.from === `+1${cleanedPhone}`
                ) {
                    return message;
                }
            });

            const filteredNulls = filteredMessages.filter(
                message => message != undefined
            );
            res.status(200).json({
                // messages: [...filteredMessagesTo, ...filteredMessagesFrom]
                message: filteredNulls
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.post('/schedule', addToScheduledMessages, (req, res) => {
    if (req.body.sec === '') {
        req.body.sec = '*';
    }
    if (req.body.min === '') {
        req.body.min = '*';
    }
    if (req.body.hour === '') {
        req.body.hour = '*';
    }
    if (req.body.dom === '') {
        req.body.dom = '*';
    }
    if (req.body.month === '') {
        req.body.month = '*';
    }
    if (req.body.weekday === '') {
        req.body.weekday = '*';
    }
    const numbers = req.body.numbers;

    const numbersArray = numbers.split(',').map(function(number) {
        return (cleanedNumber = ('' + number).replace(/\D/g, ''));
    });

    console.log(req.body, 'RECEIVED DATA');
    console.log(numbersArray, 'NUMBER');

    // const cleanedNumber = ('' + numbers).replace(/\D/g, '');

    var task = cron.schedule(
        `${req.body.sec} ${req.body.min} ${req.body.hour} ${req.body.dom} ${req.body.month} ${req.body.weekday}`,
        function() {
            console.log('---------------------');
            console.log('Running Cron Job');
            Promise.all(
                numbersArray.map(number => {
                    return client.messages.create({
                        to: `+1${numbersArray}`,
                        from: '+12513877822',
                        body: `${req.body.msg}`
                    });
                })
            )
                .then(result => {
                    res.status(200).json({ msg: 'message scheduled' });
                    task.stop();
                })
                .catch(err => console.error(err));
        }
    );
});

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

router.put('/updateScheduled/:id', (req, res) => {
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

module.exports = router;

// Nick's number:
// +12513877822

// Isaiah's number:
// +12055123191

// {
// 	"numbers": "(509) 720-4080",
// 	"sec": "",
// 	"min": "45",
// 	"hour": "9",
// 	"dom": "",
// 	"month": "",
// 	"weekday": "",
// 	"msg": "hello mason from the past!!!"
// }
