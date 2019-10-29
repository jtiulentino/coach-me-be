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
            res.status(200).json({ message: records });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}
