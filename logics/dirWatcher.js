const fsExtra = require("fs-extra");
// const chokidar = require("chokidar");
const {
  dirWatcherModel: DirWatcherModel,
  fileEventModel: FileEventModel,
} = require("../models");

const isPathExists = async (path) => {
  return await fsExtra.pathExists(path);
};

const watchFolder = async ({ folderPath, magicString }) => {
  const startTime = new Date();
  try {
    const isDirectoryExists = await isPathExists(folderPath);

    console.log({ isDirectoryExists }, "JKJBJBJBJBJBJBJB");

    if (!isDirectoryExists) {
      throw new Error("Folder path not found");
    }

    const fileList = await fsExtra.readdir(folderPath);
    console.log({ fileList }, "fileList &&&&&&&&&&&&&&&&&&&&&&&&&");

    let totalMagicStringCount = 0;

    // const chokidarWatcher = chokidar.watch(folderPath, {
    //   persistent: true,
    // });

    let fileCount = 0;

    while (fileCount < fileList.length) {
      try {
        const fileContents = await fsExtra.readFile(
          `${folderPath}/${fileList[fileCount]}`,
          "utf8"
        );

        if (fileContents.length > 0)
          totalMagicStringCount += (
            fileContents.match(new RegExp(magicString, "gi")) || []
          ).length;
      } catch (err) {
        console.error(
          `Error reading file in ${folderPath}/${
            fileList[fileCount]
          }. error : ${JSON.stringify(err)}`
        );
      }

      fileCount++;
    }

    const endTime = new Date();

    return {
      startTime,
      endTime,
      directoryPath: folderPath,
      magicString,
      magicStringCount: totalMagicStringCount,
      totalFiles: fileList.length,
      remark: "success",
      totalTimeTaken: (endTime - startTime) / 1000 + " secs",
    };
  } catch (error) {
    console.log({ error });

    const endTime = new Date();

    return {
      startTime,
      endTime,
      remark: error.message,
      directoryPath: folderPath,
      magicString,
      totalTimeTaken: (endTime - startTime) / 1000 + " secs",
    };
  }
};

const getAllDirWatcherDetails = async () => {
  return await DirWatcherModel.find({});
};

const createDirWatcherDetail = async (detail) => {
  return await DirWatcherModel.create(detail);
};

const getDirWatcherDetail = async ({ _id }) => {
  return await DirWatcherModel.findOne({ _id });
};

const updateDirWatcherDetail = async ({ _id, details }) => {
  return await DirWatcherModel.findOneAndUpdate({ _id }, details);
};

const exectuteJob = async ({ folderPath, magicString, configId }) => {
  const dirWatcherDetail = await createDirWatcherDetail({
    folderPath,
    magicString,
    configId,
  });

  const watchFolderResult = await watchFolder({
    folderPath,
    magicString,
  });
  console.log({ watchFolderResult }, "%%%%%%%%%%%%%%%%%%%%%");

  await updateDirWatcherDetail({
    _id: dirWatcherDetail._id,
    details: watchFolderResult,
  });

  return true;
};

module.exports = {
  watchFolder,
  getAllDirWatcherDetails,
  createDirWatcherDetail,
  exectuteJob,
  REST: {},
};
