const bcrypt = require("bcryptjs");
const express = require("express");
const User = require("../coachRoute/coachModel.js");

const router = express.Router();

router.post("/updatePasswordViaEmail", (req, res, next) => {
  User.findCoachByEmailJoin({
    email: req.body.email
  }).then(user => {
    // res.status(200).json({ message: user });
    // res.status(200).json({ user });
    if (user !== undefined) {
      console.log("user exists in db");
      const hash = bcrypt.hashSync(req.body.password, 4);
      req.body.password = hash;

      User.updateCoachRecord(
        { coachId: user.coachId },
        {
          coachId: user.coachId,
          coachName: user.coachName,
          email: user.email,
          password: req.body.password,
          userId: user.userId
        }
      )
        .then(results => {
          User.deleteRecoveryInstance({
            recoverId: user.recoverId
          }).then(results => {
            res.status(201).json({
              message: `CoachId ${user.coachId} password has been updated. recoverId ${user.recoverId} has been deleted.`
            });
          });
        })
        .catch(err => {
          res.status(500).json({ error: err });
        });
      // res.status(200).json({ user: req.body });
      // bcrypt
      //     .hash(req.body.password, BCRYPT_SALT_ROUNDS)
      //     .then(hashedPassword => {
      //         user.update({
      //             password: hashedPassword,
      //             resetPasswordToken: null,
      //             resetPasswordExpires: null
      //         });
      //     })
      //     .then(() => {
      //         console.log('password updated');
      //         res.status(200).send({ message: 'password updated' });
      //     });
    } else {
      console.log("no user exists in database to update");
      res.status(404).json({
        message: "no user exists in database to update"
      });
    }
  });
});

module.exports = router;
