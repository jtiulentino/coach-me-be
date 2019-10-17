const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'hello from basic route' });
});

router.post('/login', (req, res) => {
    const requestOptions = {
        headers: { accept: 'application/json' }
    };

    console.log(process.env.AIRTABLE_KEY);

    axios
        .get(
            `https://api.airtable.com/v0/app3X8S0GqsEzH9iW/Intake?api_key=${process.env.AIRTABLE_KEY}`,
            requestOptions
        )
        .then(results => {
            const newArray = [];
            for (let i = 0; i < results.data.records.length; i++) {
                console.log(results.data.records[i]);
                newArray.push(results.data.records[i]);
            }
            // console.log(results.data.records);
            res.status(200).json({
                message: 'Hello is it me youre looking?',
                data: newArray
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;
