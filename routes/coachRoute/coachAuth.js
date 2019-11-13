const jwt = require("jsonwebtoken");

module.exports = {
  generateToken,
  authenticateToken
};

function generateToken(coach) {
  const payload = { coachId: coach.coachId, coachName: coach.coachName };

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

function authenticateToken(req, res, next) {
  // dont forget to add token to headers when testing auth requests
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.status(401).json({ error: "that token does not work" });
      } else {
        req.clientInfo = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ error: "NO TOKEN" });
  }
}
