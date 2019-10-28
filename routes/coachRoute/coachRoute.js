const express = require('express');
const axios = require('axios');
const Airtable = require('airtable');

const router = express.Router();

router.get('/coachFake', (req, res) => {
    axios
        .get(
            `https://api.airtable.com/v0/${process.env.AIRTABLE_REFERENCE}/Check-ins`,
            {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.AIRTABLE_KEY}`
                }
            }
        )
        .then(result => {
            // console.log(result.data);
            const records = [...result.data.records];
            res.status(200).json({ records });
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
            return {
                clientName: record.get('Client Name'),
                startDate: record.get('Date of Check-in'),
                goal: record.get("This week's goal"),
                metGoal: record.get('Met goal?'),
                goalDetails: record.get('Goal details')
            };
        });

        let newModels = models.filter(record => record != undefined);

        console.log('new models', newModels);

        res.status(200).json({
            clientRecords: newModels
        });
    };

    base('Check-ins')
        .select({
            view: 'Grid view'
        })
        .eachPage(processPage, processRecords);
});

module.exports = router;
