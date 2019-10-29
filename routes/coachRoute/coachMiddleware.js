const axios = require('axios');

const coachDb = require('./coachModel.js');

module.exports = {
    validateCoachName
};

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
                res.status(200).json({
                    ...req.body
                });
                // next();
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

// function addToUserTable()
