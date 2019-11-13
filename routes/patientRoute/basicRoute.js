const express = require("express");
const axios = require("axios");
const twilio = require("twilio");
const Airtable = require("airtable");
// const {insertNewClient} = require('./clientModel')
// grabbing token and auth middleware

const { generateToken, authenticateToken } = require("./authenticate");
const {
  loginMiddleware,
  reformatPhoneNumber,
  validateMetrics,
  overUnderPressureValidation,
  getLoginAmount,
  addPatient
} = require("./clientMiddleware.js");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const router = express.Router();

const requestOptions = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.AIRTABLE_KEY}`
  }
};

router.get("/", (req, res) => {
  res.status(200).json({ message: "hello from basic route" });
});

// need access to data for seeding local DB
router.get("/getIntakeRecords", (req, res) => {
  axios
    .get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_REFERENCE}/Intake`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.AIRTABLE_KEY}`
        }
      }
    ) // grab the phone number and client id from the intake table to seed local db
    .then(results => {
      //empty array form client objects from the loop iteration
      let userArray = [];
      for (let i = 0; i < results.data.records.length; i++) {
        let clientObject = {};
        // grab clients phone number
        clientObject.phoneNumber = results.data.records[i].fields.Phone;
        //create new object value loginTime
        clientObject.loginTime = 0;
        // search for user unique id from 'coaching master table' reference if it exists it become clientId and if not then undefined
        if (results.data.records[i].fields["Coaching master table"]) {
          clientObject.clientId =
            results.data.records[i].fields["Coaching master table"][0];
        } else {
          clientObject.clientId = "undefined";
        }
        // take all returned objects and put them into the userArray
        userArray.push(clientObject);
      }
      // return all objects found within results as data
      res.status(200).json({ data: userArray });
    })
    .catch(err => {
      console.log(err);
    });
});

// patch for the getMetrics problem of only being able to get back 100 records.
router.get("/paginationGetMetrics", authenticateToken, (req, res) => {
  const Airtable = require("airtable");
  const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(
    process.env.AIRTABLE_REFERENCE
  );

  let records = [];
  const limit = 24;

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
      if (record.get("Client_Name")) {
        if (req.clientInfo.clientId === record.get("Client_Name")[0]) {
          return {
            fields: {
              Client_Name: record.get("Client_Name"),
              Blood_sugar: record.get("Blood_sugar"),
              Weight: record.get("Weight"),
              Blood_pressure_over: record.get("Blood_pressure_over"),
              Blood_pressure_under: record.get("Blood_pressure_under"),
              Date_time: record.get("Date_time"),
              "Record Number": record.get("Record Number")
            }
          };
        }
      }
    });

    let newModels = models.filter(record => record != undefined);

    res.status(200).json({
      clientRecords: newModels
    });
  };

  base("Outcomes")
    .select({
      view: "Grid view"
    })
    .eachPage(processPage, processRecords);
});

router.post(
  "/login",
  loginMiddleware,
  reformatPhoneNumber,
  addPatient,
  getLoginAmount,
  (req, res) => {
    const requestOptions = {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.AIRTABLE_KEY}`
      }
    };

    axios
      .get(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_REFERENCE}/Intake`,
        requestOptions
      )
      .then(results => {
        // console.log('body type', Number(req.body.clientPhone));
        // need to put the results in an object so it will return json data
        let clientObject = {};
        // declare token outside of for loop because the loop has its own scope, and we need clientObject to be generated inside the token
        let token = "";
        // looping through the results of looping through the airtable records
        for (let i = 0; i < results.data.records.length; i++) {
          if (
            // does the "phone number" from client login match any of the "phone" keys from records?
            req.body.clientPhone === results.data.records[i].fields.Phone
          ) {
            // if it does then spread results into clientObject to be referenced
            clientObject = { ...results.data.records[i] };
            // stick the new clientObject with reference data in the token
            token = generateToken(clientObject);
          }
        }

        // checks if the login user phone number exists in the intake airtable.
        // returns a status code 401 if the user can't be found.

        if (clientObject.id) {
          // console.log(results.data.records);
          // return token and client info from intake table
          res.status(200).json({
            message: `Welcome back, ${clientObject.fields["Client Name"]}!`,
            loginAttempts: req.loginTime,
            token,
            clientObject
          });
        } else {
          res.status(401).json({
            message: "user cannot be found in database"
          });
        }
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
);

router.post(
  "/logMetrics",
  authenticateToken,
  validateMetrics,
  overUnderPressureValidation,
  (req, res) => {
    // res.status(200).json({ message: 'needs something!!!!' });

    axios
      .post(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_REFERENCE}/Outcomes`,
        req.body,
        requestOptions
      )
      .then(results => {
        res.status(201).json({
          message: `record has been added for patient ${req.clientInfo.clientName}`
        });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
);

router.get("/getCoachInfo", authenticateToken, (req, res) => {
  axios
    .get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_REFERENCE}/Coaches`,
      requestOptions
    )
    .then(result => {
      // console.log('in coach table', result.data.records);

      const coachObject = {};
      for (let i = 0; i < result.data.records.length; i++) {
        if (req.clientInfo.coachId === result.data.records[i].id) {
          (coachObject.coachName = result.data.records[i].fields["Full Name"]),
            (coachObject.coachUrl = result.data.records[i].fields.Photo[0].url);
        }
      }

      // console.log('from for loop', coachObject);

      res.status(200).json({
        coachObject
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;

// experiment data
// {
//     "records": [

//       {
//         "fields": {
//           "Client_Name": [
//             "recmLlbDsUaCMUFhf"
//           ],
//           "Date_time": null,
//                   "Blood_sugar":123435643561234,
//                   "Blood_pressure_over":1421341223,
//                       "Blood_pressure_under":12321342134555,
//                   "Weight":1234
//         }
//       }

//     ]

// }
