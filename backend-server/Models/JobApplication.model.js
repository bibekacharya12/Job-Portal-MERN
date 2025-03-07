import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
  userId: {
    type: String, // this is string because we have created normal user thorugh clerk hence it will give userId in string.
    ref: "User",
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  date: {
    type: Number,
    required: true,
  },
});

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);
export default JobApplication;
