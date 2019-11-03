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

// validates all posts to /coachRoute/login to see if the req.body has an
// email and a password key.
function validateLoginPost(req, res, next) {
    if (req.body.email && req.body.password) {
        next();
    } else {
        res.status(400).json({
            message: 'Input fields require an email and password.'
        });
    }
}

// validates all posts to /coachRoute/newRegister to see if the req.body have
// name, password, and email keys within the req.body.
function validateRegisterPost(req, res, next) {
    if (req.body.name && req.body.password && req.body.email) {
        next();
    } else {
        res.status(400).json({
            message: 'You need to input a name, email, and password.'
        });
    }
}

// edge case solution where a registering coach can accidentally enter in multiple
// spaces in for there name and the endpoint can still find their name in the airtable
// database.
function formatCoachName(req, res, next) {
    let coachName = req.body.name.split(/[ ]+/);
    req.body.name = coachName.join(' ');
    next();
}

function validateCoachName(req, res, next) {
    // Calls Coaches table to get all the information of each coach. Not using pagination.
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
            // filters through all the rows in Coaches table and finds the record of the registering user.
            const records = result.data.records.filter(
                flea => flea.fields['Full Name'] === req.body.name
            );

            // inserts the needed information (for inputting new coaches in the User and Coaches tables)
            // into the req.body object for easy access.
            if (records.length > 0) {
                req.body.userPhone = records[0].fields['Google Voice Number'];
                req.body.coachId = records[0].id;
                req.body.role = 'coach';
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

// This middleware inserts the registering coach information into the server database
// particularly the users table.
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

// This middleware uses pagination to find the patient information from the Intake airtable.
// getPatientInfo is primarly used for obtaining the information needed to populate the
// users and patients table with required data.
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

        // places the resulting array into a req object so that the other middleware in the
        // chain can access it. (the next middleware is addToUserPatientTable).
        req.patientInfo = patientInfo;

        next();
    };

    base('Intake')
        .select({
            view: 'Grid view'
        })
        .eachPage(processPage, processRecords);
}

// The following middleware adds all the information from req.patientInfo into first the Users table than the
// patients table.
function addToUserPatientTable(req, res, next) {
    for (let i = 0; i < req.patientInfo.length; i++) {
        coachDb
            .findCoachByPhone({ userPhone: req.patientInfo[i].userPhone })
            .then(result => {
                console.log(result);

                // first checks if the patient already exists in the users table. if so
                // the nested promises are skipped and the loop moves onto the next patient.
                if (result === undefined) {
                    // inserts the patient into the users table.
                    coachDb
                        .insertNewUser({
                            userPhone: req.patientInfo[i].userPhone,
                            role: req.patientInfo[i].role,
                            userId: uuidv4()
                        })
                        .then(result => {
                            // finds the userId of the newly created user record in the users table.
                            coachDb
                                .findCoachByPhone({
                                    userPhone: req.patientInfo[i].userPhone
                                })
                                .then(res => {
                                    console.log('from findCoachByPhone', res);

                                    // Lastly this inserts the patient information into the patients table
                                    // including the userId.
                                    coachDb
                                        .insertNewPatient({
                                            userId: res.userId,
                                            patientId:
                                                req.patientInfo[i].patientId,
                                            patientName:
                                                req.patientInfo[i].patientName,
                                            coachId: req.patientInfo[i].coachId
                                        })
                                        .then(res => {
                                            console.log(
                                                'patient added to patient table'
                                            );
                                        })
                                        .catch(err => {
                                            console.log(
                                                'error from patient table',
                                                err
                                            );
                                        });
                                })
                                .catch(err => {
                                    console.log(
                                        'unable to find user with phone number'
                                    );
                                });
                        })
                        .catch(err => {
                            console.log('unable to add patient');
                        });
                } else {
                    console.log('patient name', req.patientInfo[i].patientName);
                }
            });
    }

    next();
}
