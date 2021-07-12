const express = require("express");
const ConfigRESTRouter = express.Router();
const _TAG = "API: config";
const Config = require("../logics/config");
const { apiErrorBuilder } = require("../utils");

const handleRequest = (fn) => (req, res) =>
  fn(
    {
      params: req.params,
      body: req.body,
      query: req.query,
    },
    {
      // Other data
      cronTask: req.cronTask,
      chokidarWatcher: req.chokidarWatcher,
      app: req.app,
    }
  )
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.error(`${err}`);
      res.status(400).json(apiErrorBuilder(err));
    });

module.exports = ConfigRESTRouter;
