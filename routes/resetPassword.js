const bcrypt = require('bcryptjs');
const User = require('./coachRoute/coachModel.js');
const express = require('express');

const router = express.Router();

router.get('/reset/:resetPasswordToken', (req, res, next) => {
    User.findCoachByToken({
        resetPasswordToken: req.params.resetPasswordToken
    })
        .then(user => {
            if (user === undefined) {
                console.log('password reset link is invalid or has expired');
                res.status(400).json({
                    message: 'password reset link is invalid or has expired'
                });
            } else {
                res.status(200).json({
                    username: user.email,
                    name: user.coachName,
                    message: 'password reset link a-ok'
                });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;
