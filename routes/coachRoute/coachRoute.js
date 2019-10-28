const express = require('express');
const axios = require('axios');
const Airtable = require('airtable');

const router = express.Router();

router.get('/coachFake', (req, res) => {
    axios
        .get(
            `https://api.airtable.com/v0/${process.env.AIRTABLE_REFERENCE}/Coaches`,
            {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.AIRTABLE_KEY}`
                }
            }
        )
        .then(result => {
            // console.log(result.data);
            const records = result.data.records.filter(
                flea => flea.fields['Full Name'] === 'Karin Underwood'
                // flea => flea.id === 'rec5UAL376PrC0shY'
            );

            res.status(200).json({ patients: records[0].fields.Patients });
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
});

router.get('/fakePagination', (req, res) => {
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(
        process.env.AIRTABLE_REFERENCE
    );

    let records = [];

    const processPage = (partialRecords, fetchNextPage) => {
        records = [...records, ...partialRecords];
        fetchNextPage();
    };

    const processRecords = err => {
        if (err) {
            console.error(err);
            return;
        }

        let models = records.map(record => {
            if ('rec5UAL376PrC0shY' === record.get('Coach')) {
                return {
                    clientName: record.get('Client Name')
                };
            }
        });

        let newModels = models.filter(record => record != undefined);

        console.log('new models', newModels);

        res.status(200).json({
            clientRecords: newModels
        });
    };

    base('Intake')
        .select({
            view: 'Grid view'
        })
        .eachPage(processPage, processRecords);
});

module.exports = router;
