const axios = require('axios');
const uuidv4 = require('uuid/v4');
const Airtable = require('airtable');

const coachDb = require('./coachModel.js');

module.exports = {
    validateCoachName,
    addToUserTable,
    formatCoachName,
    validateRegisterPost,
    validateLoginPost,
    addToUserPatientTable,
    getPatientInfo
};

function validateLoginPost(req, res, next) {
    if (req.body.email && req.body.password) {
        next();
    } else {
        res.status(400).json({
            message: 'Input fields require an email and password.'
        });
    }
}

function validateRegisterPost(req, res, next) {
    if (req.body.name && req.body.password && req.body.email) {
        next();
    } else {
        res.status(400).json({
            message: 'You need to input a name, email, and password.'
        });
    }
}

function formatCoachName(req, res, next) {
    let coachName = req.body.name.split(/[ ]+/);
    req.body.name = coachName.join(' ');
    next();
}

function validateCoachName(req, res, next) {
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

            if (records.length > 0) {
                req.body.userPhone = records[0].fields['Google Voice Number'];
                req.body.coachId = records[0].id;
                req.body.role = 'coach';
                // res.status(200).json({
                //     ...req.body
                // });
                next();
            } else {
                res.status(400).json({
                    message: "Can't find name in airtable database."
                });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

function addToUserTable(req, res, next) {
    coachDb
        .insertNewUser({
            userPhone: req.body.userPhone,
            role: req.body.role,
            userId: uuidv4()
        })
        .then(result => {
            next();
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

function getPatientInfo(req, res, next) {
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
                        patientName: record.get('Client Name'),
                        patientId: record.get('Coaching master table')[0],
                        coachId: record.get('Coach')[0],
                        role: 'patient',
                        userPhone: record.get('Phone')
                    };
                }
            }
        });

        let patientInfo = models.filter(record => record != undefined);

        // res.status(200).json({
        //     patientList: newModels
        // });

        req.patientInfo = patientInfo;

        next();
    };

    base('Intake')
        .select({
            view: 'Grid view'
        })
        .eachPage(processPage, processRecords);
}

function addToUserPatientTable(req, res, next) {
    for (let i = 0; i < req.patientInfo.length; i++) {
        coachDb
            .findCoachByPhone({ userPhone: req.patientInfo[i].userPhone })
            .then(result => {
                console.log(result);
                if (result === undefined) {
                    coachDb
                        .insertNewUser({
                            userPhone: req.patientInfo[i].userPhone,
                            role: req.patientInfo[i].role,
                            userId: uuidv4()
                        })
                        .then(result => {
                            coachDb
                                .findCoachByPhone({
                                    userPhone: req.patientInfo[i].userPhone
                                })
                                .then(res => {
                                    console.log('from findCoachByPhone', res);
                                });
                        })
                        .catch(err => {
                            console.log('unable to add patient');
                        });
                } else {
                    console.log('patient name', req.patientInfo[i].clientName);
                }
            });
    }

    res.status(200).json({ message: 'endpoint hit!!!' });
}
