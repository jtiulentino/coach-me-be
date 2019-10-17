const express = require('express');
const axios = require('axios');
const { generateToken, authenticateToken } = require('./authenticate');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'hello from basic route' });
});

router.post('/login', (req, res) => {
    const requestOptions = {
        headers: { accept: 'application/json' }
    };

    axios
        .get(
            `https://api.airtable.com/v0/app3X8S0GqsEzH9iW/Intake?api_key=${process.env.AIRTABLE_KEY}`
        )
        .then(results => {
            let clientObject = {};
            let token = '';
            for (let i = 0; i < results.data.records.length; i++) {
                if (
                    req.body.clientPhone ===
                    results.data.records[i].fields.Phone
                ) {
                    console.log(results.data.records[i]);
                    clientObject = { ...results.data.records[i] };
                    token = generateToken(clientObject);
                    console.log('token', token);
                }
            }
            // console.log(results.data.records);
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
            const clientRecords = [];
            for (let j = 0; j < results.data.records.length; j++) {
                if (
                    results.data.records[j].fields.Client_Name[0] ===
                    req.clientInfo.clientId
                ) {
                    clientRecords.push(results.data.records[j]);
                }
            }
            console.log('before dispatch', clientRecords);

            res.status(200).json({ message: 'it worked!!!', clientRecords });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;
