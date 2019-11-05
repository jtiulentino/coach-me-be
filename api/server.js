const express = require('express');
const configureMiddleware = require('./middleware');

const basicRoute = require('../routes/basicRoute.js');
const coachRoute = require('../routes/coachRoute/coachRoute.js');
const forgotRoute = require('../routes/forgotPassword.js');
// const twilioRoute = require('../routes/twilioRoute/twilioroute.js');

const server = express();

configureMiddleware(server);

server.use('/clientRoute', basicRoute);

server.use('/coachRoute', coachRoute);

server.use('/forgotRoute', forgotRoute);

// having trouble testing this endpoint.
// server.use('/twilioRoute', twilioRoute);

server.get('/', (req, res) => {
    res.status(200).json({ message: 'hello world from base server' });
});

module.exports = server;
