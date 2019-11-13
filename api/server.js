const express = require("express");
const configureMiddleware = require("./middleware");

const basicRoute = require("../routes/patientRoute/basicRoute.js");
const coachRoute = require("../routes/coachRoute/coachRoute.js");
const forgotRoute = require("../routes/forgotRoute/forgotPassword.js");
const resetRoute = require("../routes/forgotRoute/resetPassword.js");
const updatePasswordRoute = require("../routes/forgotRoute/updatePasswordViaEmail.js");
const twilioRoute = require("../routes/twilioRoute/twilioroute.js");

const server = express();

configureMiddleware(server);

server.use("/clientRoute", basicRoute);

server.use("/coachRoute", coachRoute);

server.use("/forgotRoute", forgotRoute);

server.use("/resetRoute", resetRoute);

server.use("/updatePasswordRoute", updatePasswordRoute);

// having trouble testing this endpoint.
server.use("/twilioRoute", twilioRoute);

server.get("/", (req, res) => {
  res.status(200).json({ message: "hello world from base server" });
});

module.exports = server;
