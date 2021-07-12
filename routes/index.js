const express = require("express");
const apiRouter = express.Router();
const configRESTRouter = require("./config");

apiRouter.use("/config", configRESTRouter);

module.exports = apiRouter;
