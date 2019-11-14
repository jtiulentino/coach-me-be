const Airtable = require('airtable');
const twilioDb = require('./twilioModel.js');

module.exports = {
    validateScheduledPost,
    authenticateServer
};

// validation middleware for the /twilioRoute/postScheduled and /twilioRoute/updateScheduled endpoints.
// checks if the request body contains a patientId and a message.
function validateScheduledPost(req, res, next) {
    const message = req.body;
    if (message.patientId && message.msg) {
        next();
    } else {
        res.status(401).json({
            message: 'Missing patientId or message in post request.'
        });
    }
}

// authentication function (only used by the cron server):
function authenticateServer(req, res, next) {
    const token = req.headers.authorization;

    if (token === process.env.SERVER_SECRET) {
        res.status(200).json({ message: 'server has been authenticated' });
    } else {
        res.status(401).json({ message: 'Invalid credentials.' });
    }

    // if (token) {
    //     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    //         if (err) {
    //             console.log(err);
    //             res.status(401).json({ error: 'that token does not work' });
    //         } else if (decodedToken.role !== 'coach') {
    //             res.status(401).json({
    //                 message:
    //                     'Patients are not allowed to access this part of the site'
    //             });
    //         } else {
    //             req.clientInfo = decodedToken;
    //             next();
    //         }
    //     });
    // } else {
    //     res.status(401).json({ error: 'NO TOKEN' });
    // }
}
