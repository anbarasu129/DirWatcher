const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const dirWatcherSchema = new Schema(
  {
    directoryPath: String,
    magicString: String,
    magicStringCount: Number,
    configId: { type: Schema.Types.ObjectId, ref: "config" },
    totalFiles: Number,
    startTime: Date,
    endTime: Date,
    totalTimeTaken: String,
  },
  {
    timestamps: true,
  }
);

const dirWatcherModel = Mongoose.model("dirWatcher", dirWatcherSchema);

module.exports = dirWatcherModel;
