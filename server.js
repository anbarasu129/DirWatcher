const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const { RouterMiddleware } = require("./middleware");
const db = mongoose.connection;
const ObjectId = require("mongoose").Types.ObjectId;
const chokidar = require("chokidar");
const cron = require("node-cron");

require("dotenv").config();

const { fileEventModel: FileEventModel } = require("./models");
const { ConfigLogics, DirWatcherLogics } = require("./logics");

mongoose.connect("mongodb+srv://ameen:ameen@ceg-srp.kebh5.mongodb.net/test", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connection to db established"));
app.use(cors());

app.use(express.json());

app.set("directoryPath", process.env.DIRECTORYPATH);
app.set("magicString", process.env.MAGIC_STRING);
app.set("cronTime", process.env.SCHEDULER_TIME);

let configId = new ObjectId();

app.set("configId", configId);

ConfigLogics.createDefaultConfig({ app, configId }).catch((err) => {
  console.error(`Default config data error :: ${err}`);
});

const directoryPath = app.get("directoryPath");

let chokidarWatcher = chokidar.watch(directoryPath, {
  persistent: true,
});

chokidarWatcher.on("add", async (path) => {
  console.log(`New file added in ${path}, logAt: ${new Date()}`);

  const fileEventData = {
    configId: app.get("configId"),
    filePath: path,
    fileStatus: "ADDED",
  };

  await FileEventModel.create(fileEventData);
});

chokidarWatcher.on("unlink", async (path) => {
  const fileEventData = {
    configId: app.get("configId"),
    filePath: path,
    fileStatus: "DELETED",
  };

  await FileEventModel.create(fileEventData);
  console.log(`File deleted in ${path}, logAt: ${new Date()}`);
});

let cronTask = cron.schedule(`*/${app.get("cronTime")} * * * * *`, async () => {
  try {
    const directoryPath = app.get("directoryPath");
    const magicString = app.get("magicString");
    await DirWatcherLogics.exectuteJob({
      folderPath: directoryPath,
      magicString: magicString,
      configId,
    });

    console.log(`scheduler job executed successfully startDate:${new Date()}`);
  } catch (error) {
    console.log(error);
  }
});

app.use(
  "/api/v1",
  RouterMiddleware({ app, cronTask, chokidarWatcher }),
  routes
);

app.post("/config/update", async (req, res) => {
  const newConfigData = await ConfigLogics.createConfig({
    magicString: req.body.magicString,
    directoryPath: req.body.directoryPath,
    cronTimeInSecond: req.body.cronTimeInSecond,
    app,
  });

  // stop stopChokidarJob
  chokidarWatcher.close().then(() => {
    console.log("ChokidarWatcher Closed");
  });

  //Stop CronJob
  cronTask.stop();

  cronTask = cron.schedule(`*/${app.get("cronTime")} * * * * *`, async () => {
    try {
      const directoryPath = app.get("directoryPath");
      const magicString = app.get("magicString");
      await DirWatcherLogics.exectuteJob({
        folderPath: directoryPath,
        magicString: magicString,
        configId: newConfigData._id,
      });

      console.log(
        `scheduler job executed successfully startDate:${new Date()}`
      );
    } catch (error) {
      console.log(error);
    }
  });

  chokidarWatcher = chokidar.watch(app.get("directoryPath"), {
    persistent: true,
  });

  chokidarWatcher.on("add", async (path) => {
    console.log(`New file added in ${path}, logAt: ${new Date()}`);

    const fileEventData = {
      configId: app.get("configId"),
      filePath: path,
      fileStatus: "ADDED",
    };

    await FileEventModel.create(fileEventData);
  });

  chokidarWatcher.on("unlink", async (path) => {
    const fileEventData = {
      configId: app.get("configId"),
      filePath: path,
      fileStatus: "DELETED",
    };

    await FileEventModel.create(fileEventData);
    console.log(`File deleted in ${path}, logAt: ${new Date()}`);
  });

  res.send("Cron scheduler detail updated");
});

app.listen(3000, () => {
  console.log("Connected");
});

const dispayText = () => {
  console.log(`StartDate: ${new Date()}\n`);
  console.log("Test message from Cron job");
  console.log(`EndDate: ${new Date()}\n`);
  return true;
};

module.exports = { app };
