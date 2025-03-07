import express from "express";
import multer from "multer";
import upload from "../Config/multer.config.js";
import {
  changeJobApplicationsStatus,
  changeVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
} from "../Controllers/Company.controller.js";
import { protectCompany } from "../Middlewares/auth.middleware.js";

const router = express.Router();

// register a company
router.post("/register", upload.single("image"), registerCompany);

// company login
router.post("/login", multer().none(), loginCompany);

// get company data
router.get("/company", protectCompany, getCompanyData);

// post a job
router.post("/post-job", protectCompany, postJob);

// get applicants data of company
router.get("/applicants", protectCompany, getCompanyJobApplicants);

// get company job list
router.get("/list-jobs", protectCompany, getCompanyPostedJobs);

// change applications staus
router.post("/change-status", protectCompany, changeJobApplicationsStatus);

// change applications visibility
router.post("/change-visibility", protectCompany, changeVisibility);

export default router;
