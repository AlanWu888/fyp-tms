import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const projectSchema = new Schema(
  {
    clientname: {
      type: String,
      required: true,
    },
    projectname: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    memberEmails: [
      {
        type: String,
        required: true,
      },
    ],
    removedEmails: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

projectSchema.index({ clientname: 1, projectname: 1 }, { unique: true });

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
