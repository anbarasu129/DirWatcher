const { configModel: ConfigModel } = require("../models");

const createConfig = async ({
  magicString,
  directoryPath,
  cronTimeInSecond,
  app,
}) => {
  console.log(` bsbdjbsjdbwsjbd ${magicString},
  maabdbnkndkqb ${directoryPath},
 ckackbakcbakb ${cronTimeInSecond}, &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&`);
  if (!(magicString && directoryPath && cronTimeInSecond)) {
    const _err = new Error(
      "Some config data missing. Please enter the all config details"
    );
    _err.statusCode = 400;
    throw _err;
  }

  const currentConfigData = await ConfigModel.update(
    { isDeleted: false },
    { $set: { isDeleted: true } },
    { multi: true }
  );

  let configDetail = new ConfigModel();

  if (magicString) configDetail.magicString = magicString;
  if (directoryPath) configDetail.directoryPath = directoryPath;
  if (cronTimeInSecond) configDetail.cronTimeInSecond = cronTimeInSecond;

  const newConfigData = await configDetail.save();

  app.set("directoryPath", newConfigData.directoryPath);
  app.set("magicString", newConfigData.magicString);
  app.set("cronTime", newConfigData.cronTimeInSecond);
  app.set("configId", newConfigData._id);

  return newConfigData;
};

const createDefaultConfig = async ({ app, configId }) => {
  const configData = {
    _id: configId,
    magicString: app.get("magicString"),
    directoryPath: app.get("directoryPath"),
    cronTimeInSecond: app.get("cronTime"),
  };

  const currentConfigData = await ConfigModel.update(
    { isDeleted: false },
    { $set: { isDeleted: true } },
    { multi: true }
  );

  const newConfigData = await ConfigModel.create(configData);
  app.set("configId", configId);

  return newConfigData;
};

module.exports = {
  createDefaultConfig,
  createConfig,
};
