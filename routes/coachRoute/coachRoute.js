const express = require('express');
const axios = require('axios');
const Airtable = require('airtable');
const bcrypt = require('bcryptjs');
const coachDb = require('./coachModel.js');
const uuidv4 = require('uuid/v4');

const { generateToken, authenticateToken } = require('./coachAuth.js');
const {
    validateCoachName,
    addToUserTable,
    formatCoachName,
    validateRegisterPost,
    validateLoginPost,
    getPatientInfo,
    addToUserPatientTable
} = require('./coachMiddleware.js');

const router = express.Router();

// refactored registration endpoint.
router.post(
    '/newRegister',
    validateRegisterPost,
    formatCoachName,
    validateCoachName,
    addToUserTable,
    (req, res) => {
        // used to get the userId from the users table.
        coachDb
            .findCoachByPhone({ userPhone: req.body.userPhone })
            .then(result => {
                // hashes the coach's password before being inserted into the coaches table
                const hash = bcrypt.hashSync(req.body.password, 4);
                req.body.password = hash;

                // inserts coach information into the coaches table.
                coachDb
                    .insertNewCoach({
                        coachId: req.body.coachId,
                        coachName: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        userId: result.userId
                    })
                    .then(result => {
                        // res.status(201).json({
                        //     message: 'new Coach has been added to coach table!'
                        // });
                        let coach = req.body;

                        // used to find the registering coach's information and generates a jsonwebtoken
                        // that can be used in the frontend.
                        coachDb
                            .findCoachByEmail({ email: coach.email })
                            .then(userInfo => {
                                const token = generateToken(userInfo);
                                res.status(200).json({
                                    message: `Coach ${userInfo.coachName} has been register in database.`,
                                    token
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
                res.status(500).json({ message: err });
            });
    }
);

// old register endpoint (no longer in use).
router.post('/register', (req, res) => {
    let coach = req.body;

    const hash = bcrypt.hashSync(coach.password, 4);
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

// coach login endpoint.
router.post('/login', validateLoginPost, (req, res) => {
    let coach = req.body;

    // checks to see if the login email is actually in the coaches table.
    coachDb
        .findCoachByEmail({ email: coach.email })
        .then(userInfo => {
            console.log(userInfo);
            if (
                coach &&
                bcrypt.compareSync(coach.password, userInfo.password)
            ) {
                const token = generateToken(userInfo);
                res.status(200).json({
                    message: `Welcome back!!!! ${userInfo.coachName}`,
                    coachName: userInfo.coachName,
                    token
                });
            } else {
                res.status(401).json({
                    message: 'Invalid username or password'
                });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// getPatients endpoint: returns an array of patients according to the coachId of the
// logged in account. Uses pagination airtable function.
router.get(
    '/getPatients',
    authenticateToken,
    getPatientInfo,
    addToUserPatientTable,
    (req, res) => {
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
                // return record;
                if (record.get('Coach')) {
                    if (req.clientInfo.coachId === record.get('Coach')[0]) {
                        return {
                            clientName: record.get('Client Name'),
                            clientId: record.get('Coaching master table')[0],
                            conditions: record.get('Conditions'),
                            motivations: record.get('Motivations'),
                            language: record.get('Language'),
                            clientPhone: record.get('Phone')
                        };
                    }
                }
            });

            let newModels = models.filter(record => record != undefined);

            // console.log('new models', newModels);

            res.status(200).json({
                patientList: newModels
            });
        };

        base('Intake')
            .select({
                view: 'Grid view'
            })
            .eachPage(processPage, processRecords);
    }
);

// getClientGoals endpoint. Returns an array of goals of the passed in patientId.
// The patientId needs to exist on airtable for an array to be returned.
router.get('/getClientGoals/:id', (req, res) => {
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(
        process.env.AIRTABLE_REFERENCE
    );

    const patientId = req.params.id;

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
            // return record;
            if (record.get('Client Name')) {
                if (patientId === record.get('Client Name')[0]) {
                    return {
                        clientId: record.get('Client Name')[0],
                        goal: record.get("This week's goal"),
                        goalDetails: record.get('Goal details'),
                        startDate: record.get('Date of Check-in'),
                        metGoal: record.get('Met goal?'),
                        notes: record.get('Notes from check-in')
                    };
                }
            }
        });

        let newModels = models.filter(record => record != undefined);

        console.log('new models', newModels);

        res.status(200).json({
            patientGoals: newModels
        });
    };

    base('Check-ins')
        .select({
            view: 'Grid view'
        })
        .eachPage(processPage, processRecords);
});

// getClientMetrics/:id. Returns an array of all the health metrics of a passed in patientId.
// The patientId needs to exist on airtable for an array to be returned.
router.get('/getClientMetrics/:id', (req, res) => {
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(
        process.env.AIRTABLE_REFERENCE
    );

    const patientId = req.params.id;

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
            // return record;
            if (record.get('Client_Name')) {
                if (patientId === record.get('Client_Name')[0]) {
                    return {
                        clientId: record.get('Client_Name')[0],
                        date: record.get('Date_time'),
                        Blood_pressure_over: record.get('Blood_pressure_over'),
                        Blood_pressure_under: record.get(
                            'Blood_pressure_under'
                        ),
                        Weight: record.get('Weight'),
                        Blood_sugar: record.get('Blood_sugar')
                    };
                }
            }
        });

        let newModels = models.filter(record => record != undefined);

        console.log('new models', newModels);

        res.status(200).json({
            patientMetrics: newModels
        });
    };

    base('Outcomes')
        .select({
            view: 'Grid view'
        })
        .eachPage(processPage, processRecords);
});

// getLastCheckinTime/:id Returns the date of the last checkin using the patientId from airtable.
router.get('/getLastCheckinTime/:id', (req, res) => {
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(
        process.env.AIRTABLE_REFERENCE
    );

    const patientId = req.params.id;

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
            // return record.id;
            if (patientId === record.id) {
                return {
                    lastCheckin: record.get('Days Since Last Check-in')
                };
            }
        });

        let newModels = models.filter(record => record != undefined);

        res.status(200).json({
            lastCheckin: newModels[0].lastCheckin,
            clientId: patientId
        });
    };

    base('Master')
        .select({
            view: 'Grid view'
        })
        .eachPage(processPage, processRecords);
});

// creates conversation instance in the conversations table. Requires coachId and patientId:
router.post('/makeConversation', authenticateToken, (req, res) => {
    req.body.coachId = req.clientInfo.coachId;
    req.body.conversationId = uuidv4();
    coachDb
        .insertConversation(req.body)
        .then(result => {
            res.status(201).json({
                message: 'New conversation has been added'
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;
