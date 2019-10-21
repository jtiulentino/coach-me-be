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
                    error: 'Phone needs to be 10 characters'
                });
            }
        } else {
            res.status(422).json({ error: 'phone needs to be integers' });
        }
    } else {
        res.status(404).json({ error: 'client phone number not found' });
    }
}

function reformatPhoneNumber(req, res, next) {
    req.body.clientPhone = req.body.clientPhone.replace(
        /(\d{3})(\d{3})(\d{4})/,
        '($1) $2-$3'
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
                metric === 'Blood_pressure_over' ||
                metric === 'Blood_pressure_under' ||
                metric === 'Blood_sugar' ||
                metric === 'Weight'
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
                error: 'One of the values is over three digits'
            });
        }
    } else {
        res.status(422).json({
            error: 'less than three keys inside records.fields(no metrics)'
        });
    }
}



module.exports = {
    loginMiddleware,
    reformatPhoneNumber,
    validateMetrics,
    overUnderPressureValidation
};

// experiment data
// {
//     "records": [

//       {
//         "fields": {
//           "Client_Name": [
//             "rec8DkcsKev4Q8EvF"
//           ],
//           "Date_time": null,
//   "Blood_sugar":123435643561234,
//   "Blood_pressure_over":1421341223,
//   "Blood_pressure_under":12321342134555,
//   "Weight":1234
//         }
//       }

//     ]

//    }
