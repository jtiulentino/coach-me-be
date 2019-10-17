const jwt = require('jsonwebtoken');


module.exports = {
	generateToken
};

function generateToken(client) {
	const payload = {
		clientId: client.id,
		clientName: client.fields["Client Name"]
	};

	const options = {
		expiresIn: '1d'
	};

	return jwt.sign(payload, process.env.JWT_SECRET, options);
}

// module.exports = (req, res, next) => {
// 	const token = req.headers.authorization;
// 	console.log(token);

// 	if (token) {
// 		jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
// 			if (err) {
// 				console.log(err);
// 				res.status(401).json({ error: 'that token does not work' });
// 			} else {
// 				req.decodedJwt = decodedToken;
// 				console.log('decoded token', req.decodedJwt);
// 				next();
// 			}
// 		});
// 	} else {
// 		res.status(401).json({ error: 'NO TOKEN' });
// 	}
// };
