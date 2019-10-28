import crypto from 'crypto';
require('dotenv').config();

const nodemailer = require('nodemailer');

module.exports = app => {
    app.post('/forgotPassword', (req, res, next) => {
        // Error Handling
        if (req.body.email === '') {
            res.json('email required');
        }
        console.log(req.body.email);
    });
};
