import Company from "../Models/Company.model.js";
import Job from "../Models/Job.model.js";
import JobApplication from "../Models/JobApplication.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../Utilis/generateToken.js";

// register a new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({ sucess: false, message: "Company already registered" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // image uploading on cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    // save to the database
    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// company login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Missing details or invalid credentials",
      });
    }

    const company = await Company.findOne({ email });

    if (!company) {
      return res.json({
        success: false,
        message: "Account not registered",
      });
    }

    if (await bcrypt.compare(password, company.password)) {
      res.json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company._id),
      });
    } else {
      res.json({
        succes: false,
        message: "Email or Password incorrect!",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get company data
export const getCompanyData = async (req, res) => {
  try {
    // login validation done and with id as payload value the company info was added to req.company using custom middleware in routes file
    const company = req.company;
    res.json({ success: true, company });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// post a new job
export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body;
  const companyId = req.company._id;
  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category,
    });
    await newJob.save();
    res.json({ success: true, newJob });
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};

// get company job applicants
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;

    // find job applications for the  user and populate related data
    const applications = await JobApplication.find({ companyId })
      .populate("userId", "name image resume")
      .populate("jobId", "title location category level salary")
      .exec();
    return res.json({
      success: true,
      applications,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });

    //  adding number of applicants  info in data
    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.find({ jobId: job._id });
        return { ...job.toObject(), applicants: applicants.length };
      })
    );

    res.json({ success: true, jobsData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// change job applications status
export const changeJobApplicationsStatus = async (req, res) => {
  const { id, status } = req.body;

  try {
    // find job application and update status
    await JobApplication.findOneAndUpdate({ _id: id }, { status });
    res.json({ success: true, message: "Status Changed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// change job visibility
export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;

    const job = await Job.findById(id);
    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
    }
    await job.save();
    res.json({ sucess: true, job });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
