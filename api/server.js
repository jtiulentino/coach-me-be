const express = require('express');
const configureMiddleware = require('./middleware');

const basicRoute = require('../routes/basicRoute.js');

const server = express();

configureMiddleware(server);

server.use('/clientRoute', basicRoute);

server.get('/', (req, res) => {
    res.status(200).json({ message: 'hello world from base server' });
});

module.exports = server;
