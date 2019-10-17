const express = require('express');
// const configureMiddleware = require('./middleware');
const helmet = require('helmet');
const cors = require('cors');

const basicRoute = require('../routes/basicRoute.js');

const server = express();

server.use(helmet());
server.use(express.json());
// server.use(logger);
server.use(cors());

server.use('/basicRoute', basicRoute);

server.get('/', (req, res) => {
    res.status(200).json({ message: 'hello world from base server' });
});

module.exports = server;
