const configRouerData =
  ({ app, cronTask, chokidarWatcher }) =>
  (req, res, next) => {
    req.cronTask = cronTask;
    req.chokidarWatcher = chokidarWatcher;

    next();
  };

module.exports = configRouerData;
