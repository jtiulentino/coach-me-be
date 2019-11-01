const express = require('express');
const axios = require('axios');
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const cronJob = require('cron').CronJob;

const {
    generateToken,
    authenticateToken
} = require('../coachRoute/coachAuth.js');

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
            const filteredMessagesTo = messages.filter(
                message => message.to === `+1${cleanedPhone}`
            );
            const filteredMessagesFrom = messages.filter(
                message => message.from === `+1${cleanedPhone}`
            );
            res.status(200).json({
                messages: [...filteredMessagesTo, ...filteredMessagesFrom]
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.post('/schedule', (req, res) => {
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
    if (req.body.year === '') {
        req.body.year = '*';
    }
    console.log(req.body, 'RECEIVED DATA');

    let cleanedNumber = ('' + req.body.Phone).replace(/\D/g, '');

    const numbers = req.body.numbers;

    var textJob = new cronJob(
        `${req.body.min} ${req.body.hour} ${req.body.dom} ${req.body.month} ${req.body.weekday} ${req.body.year}`,
        function() {
            // for (var i = 0; i < numbers.length; i++) {
            client.messages.create(
                {
                    to: `+1${cleanedNumber}`,
                    from: '+12513877822',
                    body: `${req.body.msg}`
                },
                function(err, data) {
                    console.log(data.body);
                }
            );
            // }
        },
        null,
        true
    );
    res.status(200).json({
        message: 'message has been scheduled!'
    });
});

module.exports = router;

// {
// 	"min": "03",
// 	"hour": "9",
// 	"dom": "*",
// 	"month": "*",
// 	"weekday": "*",
// 	"year": "*",
// 	"msg": "Sent Sucessfully",
// 	"Phone": "(509) 720-4080"
// }
