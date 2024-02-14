import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const timesheetSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    entries: [
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
        time: {
          type: Number,
          required: true,
        },
      },
    ],
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Timesheet =
  mongoose.models.Timesheet || mongoose.model("Timesheet", timesheetSchema);

export default Timesheet;
