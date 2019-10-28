const express = require('express');
const axios = require('axios');
const Airtable = require('airtable');
const bcrypt = require('bcryptjs');
const coachDb = require('./coachModel.js');
const uuidv4 = require('uuid/v4');

const router = express.Router();

router.post('/register', (req, res) => {
    let coach = req.body;

    const hash = bcrypt.hashSync(coach.password, 14);
    coach.password = hash;

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
            const records = result.data.records.filter(
                flea => flea.fields['Full Name'] === req.body.name
            );

            const coachObject = {};
            coachObject.coachId = records[0].id;
            coachObject.phoneNumber = records[0].fields['Google Voice Number'];
            const newCoachObject = { ...coachObject, ...coach };

            // res.status(200).json({ newCoachObject });

            coachDb
                .insertNewUser({
                    userPhone: newCoachObject.phoneNumber,
                    role: 'coach',
                    userId: uuidv4()
                })
                .then(results => {
                    console.log(newCoachObject);
                    coachDb
                        .findCoachByPhone({
                            userPhone: newCoachObject.phoneNumber
                        })
                        .then(results => {
                            coachDb
                                .insertNewCoach({
                                    coachId: newCoachObject.coachId,
                                    userId: results.userId,
                                    coachName: newCoachObject.name,
                                    password: newCoachObject.password,
                                    email: newCoachObject.email
                                })
                                .then(results => {
                                    res.status(200).json({
                                        message:
                                            'a new coach has been registered',
                                        id: results[0]
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json({ error: err });
                                });
                        })
                        .catch(err => {
                            res.status(500).json({ error: err });
                        });
                })
                .catch(err => {
                    res.status(500).json({ error: err });
                });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.post('/login', (req, res) => {});

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
