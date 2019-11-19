const {
  findPatientByPhone,
  updateLoginTime,
  insertNewClient
} = require("./clientModel.js");

function loginMiddleware(req, res, next) {
  // checks to see if req.body has clientPhone key.
  if (req.body.clientPhone) {
    // console.log('inside the middleware', Number(req.body.clientPhone));

    // middleware check to see if req.body has all integers in place of english characters
    if (/^\d+$/.test(req.body.clientPhone) === true) {
      // middleware for
      if (req.body.clientPhone.length === 10) {
        // console.log(req.body.clientPhone.length);
        next();
      } else {
        res.status(422).json({
          error: "Phone needs to be 10 characters"
        });
      }
    } else {
      res.status(422).json({ error: "phone needs to be integers" });
    }
  } else {
    res.status(404).json({ error: "client phone number not found" });
  }
}

function reformatPhoneNumber(req, res, next) {
  // phone number needs to be received by airtable in a specific format (123) 123-1234. But the input from FE is 1234567899
  req.body.clientPhone = req.body.clientPhone.replace(
    /(\d{3})(\d{3})(\d{4})/,
    "($1) $2-$3"
  );
  next();
}

function validateMetrics(req, res, next) {
  if (Object.keys(req.body.records[0].fields).length > 2) {
    // console.log(req.body.records[0].fields.Blood_sugar);
    // res.status(200).json({ message: 'It works!!!' });

    let validMetrics = true;

    for (metric in req.body.records[0].fields) {
      // console.log('from metric for in loop', metric);
      if (
        metric === "Blood_pressure_over" ||
        metric === "Blood_pressure_under" ||
        metric === "Blood_sugar" ||
        metric === "Weight"
      ) {
        if (req.body.records[0].fields[metric].toString().length > 3) {
          // console.log('from metric for of loop', metric);
          validMetrics = false;
        }
      }
    }

    if (validMetrics) {
      next();
    } else {
      res.status(422).json({
        error: "One of the values is over three digits"
      });
    }
  } else {
    res.status(422).json({
      error: "less than three keys inside records.fields(no metrics)"
    });
  }
}

function overUnderPressureValidation(req, res, next) {
  // need to check if both over and under are inputed together as one, otherwise throw error that say both are needed

  if (
    req.body.records[0].fields.Blood_pressure_under ||
    req.body.records[0].fields.Blood_pressure_over
  ) {
    if (
      req.body.records[0].fields.Blood_pressure_over &&
      req.body.records[0].fields.Blood_pressure_under
    ) {
      next();
    } else {
      res.status(422).json({
        error:
          "Input must include both over blood pressure and under blood pressure"
      });
    }
  } else {
    next();
  }
}

function addPatient(req, res, next) {
  findPatientByPhone({ phoneNumber: req.body.clientPhone }).then(result => {
    if (result.length === 0) {
      insertNewClient({
        phoneNumber: req.body.clientPhone,
        clientId: null,
        loginTime: 0
      })
        .then(result => {
          next();
        })
        .catch(err => {
          res.status(500).json({ error: "INSERT not working" });
        });
    } else {
      // res.status(200).json({ message: 'user is already saved' });
      next();
    }
  });
}

function getLoginAmount(req, res, next) {
  // find clientPhone by comparing to phoneNumber key in the patient-login db. The patient-login DB is seeded from the /getIntakeRecords endpoint found in basicRoutes
  findPatientByPhone({ phoneNumber: req.body.clientPhone })
    .first()
    .then(result => {
      //check to see if the result has a loginTime that has a value less than or equal to zero.

      if (result.loginTime <= 0) {
        // seeded values are strings and need conversion to integers
        result.loginTime = Number(result.loginTime) + 1;
        // console.log('onlogin middleware', result.loginTime);
        req.loginTime = result.loginTime;

        //updates the LoginTime associated with the phoneNumber on first login
        updateLoginTime({ phoneNumber: result.phoneNumber }, result)
          .then(results => {
            next();
          })
          .catch(err => {
            res.status(500).json({
              error: "unable to update record in patient-login"
            });
          });
      } else {
        // iterates LoginTime past 1 so FE can see if client has already logged in before
        req.loginTime = Number(result.loginTime) + 1;
        next();
      }
    })
    .catch(err => {
      res.status(500).json({ message: "didnt work!!!" });
    });
}

module.exports = {
  loginMiddleware,
  reformatPhoneNumber,
  validateMetrics,
  overUnderPressureValidation,
  getLoginAmount,
  addPatient
};
