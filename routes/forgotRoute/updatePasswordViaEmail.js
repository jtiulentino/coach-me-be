const bcrypt = require("bcryptjs");
const express = require("express");
const User = require("../coachRoute/coachModel.js");

const router = express.Router();

router.post("/updatePasswordViaEmail", (req, res, next) => {
  User.findCoachByEmailJoin({
    email: req.body.email
  }).then(user => {
    if (user !== undefined) {
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
    } else {
      res.status(404).json({
        message: "no user exists in database to update"
      });
    }
  });
});

module.exports = router;
