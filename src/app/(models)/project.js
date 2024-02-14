import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const projectSchema = new Schema(
  {
    Projectname: {
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
    members: [
      {
        user: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
