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

module.exports = {
    loginMiddleware,
    reformatPhoneNumber
};
