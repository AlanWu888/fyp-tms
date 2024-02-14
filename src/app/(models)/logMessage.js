import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const logSchema = new Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    messageDescription: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const LogMessage =
  mongoose.models.LogMessage || mongoose.model("LogMessage", logSchema);

export default LogMessage;
