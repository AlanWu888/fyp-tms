import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const TaskSchema = new Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    taskDescription: {
      type: String,
      required: true,
    },
    taskNotes: {
      type: String,
    },
    taskType: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
