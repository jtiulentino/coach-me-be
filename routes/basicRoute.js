const express = require('express');
const axios = require('axios');
// grabbing token and auth middleware
const { generateToken, authenticateToken } = require('./authenticate');
const {
    loginMiddleware,
    reformatPhoneNumber
} = require('./clientMiddleware.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'hello from basic route' });
});

router.post('/login', loginMiddleware, reformatPhoneNumber, (req, res) => {
    const requestOptions = {
        headers: { accept: 'application/json' }
    };

    axios
        .get(
            `https://api.airtable.com/v0/app3X8S0GqsEzH9iW/Intake?api_key=${process.env.AIRTABLE_KEY}`
        )
        .then(results => {
            // console.log('body type', Number(req.body.clientPhone));
            // need to put the results in an object so it will return json data
            let clientObject = {};
            // declare token outside of for loop because the loop has its own scope, and we need clientObject to be generated inside the token
            let token = '';
            // looping through the results of looping through the airtable records
            for (let i = 0; i < results.data.records.length; i++) {
                if (
                    // does the "phone number" from client login match any of the "phone" keys from records?
                    req.body.clientPhone ===
                    results.data.records[i].fields.Phone
                ) {
                    console.log(results.data.records[i]);
                    // if it does then spread results into clientObject to be referenced
                    clientObject = { ...results.data.records[i] };
                    // stick the new clientObject with reference data in the token
                    token = generateToken(clientObject);
                    console.log('token', token);
                }
            }
            // console.log(results.data.records);
            // return token and client info from intake table
            res.status(200).json({
                message: `Welcome back, ${clientObject.fields['Client Name']}!`,
                token,
                clientObject
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/getMetrics', authenticateToken, (req, res) => {
    // res.status(200).json({ message: req.clientInfo });
    axios
        .get(
            `https://api.airtable.com/v0/app3X8S0GqsEzH9iW/Outcomes/?filterByFormula=OR({Blood_sugar}!='',{Weight}!='',{Blood_pressure_over}!='')&api_key=${process.env.AIRTABLE_KEY}`
        )
        .then(results => {
            // declare clientRecords out of the for loop scope to reference data returned from outcomes table
            const clientRecords = [];
            // looping through data received
            for (let j = 0; j < results.data.records.length; j++) {
                if (
                    // if the client name is equal to the clientId from intake table then return client record
                    results.data.records[j].fields.Client_Name[0] ===
                    req.clientInfo.clientId
                ) {
                    // push into empty array so we can access records
                    clientRecords.push(results.data.records[j]);
                }
            }
            // console.log('clientRecords', clientRecords);

            res.status(200).json({ message: 'it worked!!!', clientRecords });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch('/logMetrics', (req, res) => {
    res.status(200).json({ message: 'needs something' });
});

module.exports = router;
