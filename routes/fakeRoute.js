const express = require('express');
const axios = require('axios');

router.get('/getIntakeRecords', (req, res) => {
    axios
        .get(
            `https://api.airtable.com/v0/${process.env.AIRTABLE_REFERENCE}/Intake`,
            {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.AIRTABLE_KEY}`
                }
            }
        )
        .then(results => {
            let userArray = [];
            for (let i = 0; i < results.data.records.length; i++) {
                let clientObject = {};
                clientObject.phoneNumber = results.data.records[i].fields.Phone;
                clientObject.loginTime = 0;
                if (results.data.records[i].fields['Coaching master table']) {
                    clientObject.clientId =
                        results.data.records[i].fields[
                            'Coaching master table'
                        ][0];
                } else {
                    clientObject.clientId = 'undefined';
                }
                userArray.push(clientObject);
            }

            res.status(200).json({ data: userArray });
        })
        .catch(err => {
            console.log(err);
        });
});
