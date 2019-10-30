const bcrypt = require('bcryptjs');
const User = require('./coachRoute/coachModel.js');

const router = express.Router();

router.get('/reset', (req, res, next) => {
    User.findCoachByEmail({
        resetPasswordToken: req.query.resetPasswordToken,
        resetPasswordExpires: Date.now() // Check if an hour has passed using Date.now()
    }).then(user => {
        if (user === null) {
            console.log('password reset link is invalid or has expired');
            res.json('password reset link is invalid or has expired');
        } else {
            res.status(200).send({
                username: user.username,
                message: 'password reset link a-ok'
            });
        }
    });
});

module.exports = router;
