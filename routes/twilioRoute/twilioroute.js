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
router.get('/messagehistory/:phone', authenticateToken, (req, res) => {
    let cleanedPhone = ('' + req.params.phone).replace(/\D/g, '');
    res.status(200).json({ Phone: cleanedPhone });
    client.messages

        .list({ limit: 100 })
        // .then(res.status(200).json(messages => messages.map(m=>(m.sid))))

        .then(messages => {
            const filteredMessages = messages.filter();
            res.status(200).json({ messages });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;
