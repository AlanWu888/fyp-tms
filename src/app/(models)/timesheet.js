import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const timesheetSchema = new Schema(
  {
    userEmail: {
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

timesheetSchema.index({ userEmail: 1, date: 1 }, { unique: true });

const Timesheet =
  mongoose.models.Timesheet || mongoose.model("Timesheet", timesheetSchema);

export default Timesheet;
