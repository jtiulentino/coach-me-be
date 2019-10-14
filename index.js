require('dotenv').config();

const server = require('./api/server.js');

server.listen(process.env.PORT, () => {
    console.log(`Listening to port: ${process.env.PORT}`);
});