const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const basicRoute = require('../routes/basicRoute.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.status(200).json({message: 'hello world from base server'})
});

server.use('/basicRoute', basicRoute);

module.exports = server;