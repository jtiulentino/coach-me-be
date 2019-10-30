const express = require('express');
const axios = require('axios');
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

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
    client.messages
        .create({
            body: `${req.body.message}`,
            from: '+12513877822',
            to: `${req.body.number}`
        })

        .then(message => res.status(201).json(message.sid))
        .catch(err => {
            console.log(err);
        });
});
router.get('/messagehistory', (req, res) => {
    client.messages

        .list({ limit: 100 })
        // .then(res.status(200).json(messages => messages.map(m=>(m.sid))))

        .then(messages =>
            messages.map(m =>
                console.log(
                    m.sid,
                    m.body,
                    m.to,
                    m.from,
                    m.direction,
                    m.dateSent
                )
            )
        );
});

module.exports = router;
