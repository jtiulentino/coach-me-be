const bcrypt = require('bcryptjs');
const User = require('./coachRoute/coachModel.js');

const router = express.Router();

router.put('/updatePasswordViaEmail', (req, res, next) => {
    User.findCoachByPhone({
        phone: req.body.phone
    }).then(user => {
        if (user !== null) {
            console.log('user exists in db');
            bcrypt
                .hash(req.body.password, BCRYPT_SALT_ROUNDS)
                .then(hashedPassword => {
                    user.update({
                        password: hashedPassword,
                        resetPasswordToken: null,
                        resetPasswordExpires: null
                    });
                })
                .then(() => {
                    console.log('password updated');
                    res.status(200).send({ message: 'password updated' });
                });
        } else {
            console.log('no user exists in database to update');
            res.status(404).json('no user exists in database to update');
        }
    });
});

module.exports = router;
