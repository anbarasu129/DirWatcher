const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const configSchema = new Schema(
  {
    magicString: String,
    directoryPath: String,
    cronTimeInSecond: Number,
  },
  {
    timestamps: true,
  }
);

const configModel = Mongoose.model("config", configSchema);

module.exports = configModel;
