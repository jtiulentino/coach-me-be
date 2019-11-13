const express = require("express");
const uuidv4 = require("uuid/v4");
const axios = require("axios");
const http = require("http");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const cron = require("node-cron");

const {
  generateToken,
  authenticateToken
} = require("../coachRoute/coachAuth.js");

const { validateScheduledPost } = require("./twilioMiddleware.js");

const twilioDb = require("./twilioModel.js");

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const router = express.Router();
//sends message through twilio
router.post("/twilio", (req, res) => {
  // res.status(200).json({ lookit: req.body });
  let cleanedNumber = ("" + req.body.Phone).replace(/\D/g, "");

  // res.status(200).json({ cleaned });
  console.log("number from dotenv file", process.env.TWILIO_NUMBER);

  client.messages
    .create({
      body: `${req.body.message}`,
      from: `${process.env.TWILIO_NUMBER}`,
      to: `+1${cleanedNumber}`
    })

    .then(message => res.status(201).json(message.sid))
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.get("/messagehistory/:phone", (req, res) => {
  let cleanedPhone = ("" + req.params.phone).replace(/\D/g, "");
  client.messages

    .list({ limit: 9000 })

    .then(messages => {
      // const filteredMessagesTo = messages.filter(
      //     message => message.to === `+1${cleanedPhone}`
      // );
      // const filteredMessagesFrom = messages.filter(
      //     message => message.from === `+1${cleanedPhone}`
      // );
      const filteredMessages = messages.reverse().map(message => {
        if (
          message.to === `+1${cleanedPhone}` ||
          message.from === `+1${cleanedPhone}`
        ) {
          return message;
        }
      });

      const filteredNulls = filteredMessages.filter(
        message => message != undefined
      );
      res.status(200).json({
        // messages: [...filteredMessagesTo, ...filteredMessagesFrom]
        message: filteredNulls
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

// Scheduling crude functionality:
router.post("/postScheduled", validateScheduledPost, (req, res) => {
  req.body.scheduleId = uuidv4();

  twilioDb
    .insertScheduledMessage(req.body)
    .then(results => {
      res.status(201).json({
        message: `new scheduled message has been inserted for patientId ${req.body.patientId}`
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.get("/getScheduled/:id", (req, res) => {
  twilioDb
    .getScheduledByPatientId({ patientId: req.params.id })
    .then(results => {
      res.status(200).json({ data: results });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.delete("/deleteScheduled/:id", (req, res) => {
  twilioDb
    .deleteScheduled({ scheduleId: req.params.id })
    .then(results => {
      if (results) {
        res.status(200).json({
          message: `scheduled message scheduleId ${req.params.id} has been deleted.`
        });
      } else {
        res.status(404).json({
          message: `scheduled message scheduleId ${req.params.id} can not be found.`
        });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "unable to delete entry" });
    });
});

router.put("/updateScheduled/:id", validateScheduledPost, (req, res) => {
  twilioDb
    .updateScheduled({ scheduleId: req.params.id }, req.body)
    .then(results => {
      if (results) {
        res.status(200).json({
          message: `scheduleId ${req.params.id} has been updated.`
        });
      } else {
        res.status(404).json({
          message: `unable to find scheduleId ${req.params.id} in database.`
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

// get request for possible cron server:
router.get("/getAllScheduledMessages", (req, res) => {
  twilioDb
    .getAllScheduled()
    .then(results => {
      res.status(200).json({
        message: "receiving all messages from messageHistory table.",
        data: results
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;

// Nick's number:
// +12513877822

// Isaiah's number:
// +12055123191

// {
// 	"patientId": "recmLlbDsUaCMUFhf",
//     "msg": "hello mason good morning!",
//     "min": "07",
//     "hour": "8",
//     "weekday": "Tuesday"
// }
