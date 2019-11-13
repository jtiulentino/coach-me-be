const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const coachDb = require("../coachRoute/coachModel.js");
const express = require("express");
const uuidv4 = require("uuid/v4");
const User = require("../coachRoute/coachModel.js");

const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/forgotPassword", (req, res, next) => {
  // Error Handling
  if (req.body.email === "") {
    res.json("email required");
  }
  coachDb
    .findCoachByEmail({
      email: req.body.email
    })
    .then(user => {
      if (user === null) {
        res.status(400).json({ message: "email not in db" });
      } else {
        const token = crypto.randomBytes(20).toString("hex");

        coachDb
          .insertRecoveryPassword({
            resetPasswordToken: token,
            resetPasswordExpires: `${Date.now() + 360000}`,
            recoverId: uuidv4(),
            coachId: user.coachId
          })
          .then(results => {
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: `${process.env.EMAIL_ADDRESS}`,
                pass: `${process.env.EMAIL_PASSWORD}`
              }
            });

            const mailOptions = {
              from: `${process.env.EMAIL_ADDRESS}`,
              to: `${user.email}`,
              subject: `Link To Reset Password`,
              text:
                `You are receiving this because you (or someone else) have requested the reset of the password for your account. \n\n` +
                `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: \n\n` +
                `http://localhost:3000/reset/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };

            // res.status(200).json({ message: 'sending mail' });

            transporter.sendMail(mailOptions, function(err, response) {
              if (err) {
                res.status(401).json({
                  message: "invalid username or password."
                });
              } else {
                res.status(200).json({
                  message: "recovery email sent"
                });
              }
            });
          })
          .catch(err => {
            res.status(500).json({ error: err });
          });
      }
    });
});

module.exports = router;
