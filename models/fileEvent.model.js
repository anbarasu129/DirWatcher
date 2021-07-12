const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const fileEventSchema = new Schema(
  {
    configId: { type: Schema.Types.ObjectId, ref: "config" },
    filePath: String,
    fileStatus: { type: String, enum: ["ADDED", "DELETED"] },
  },
  {
    timestamps: true,
  }
);

const fileEventModel = Mongoose.model("fileEvent", fileEventSchema);

module.exports = fileEventModel;
