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
        console.log(req.body.records[0].fields.Blood_sugar);
        // res.status(200).json({ message: 'It works!!!' });
        for (metric in req.body.records[0].fields) {
            console.log('from metric for in loop', metric);
            if (
                metric === 'Blood_pressure_over' ||
                metric === 'Blood_pressure_under' ||
                metric === 'Blood_sugar' ||
                metric === 'Weight'
            ) {
                if (req.body.records[0].fields[metric].toString().length <= 3) {
                    console.log('from metric for of loop', metric);
                    res.status(200).json({
                        message: 'less than three integers'
                    });
                } else {
                    res.status(400).json({
                        message: 'more than three integers'
                    });
                }
            }
        }
        // res.status(200).json({ message: 'It works!!!' });
    } else {
        res.status(401).json({ message: 'less than two' });
    }
}

module.exports = {
    loginMiddleware,
    reformatPhoneNumber,
    validateMetrics
};
