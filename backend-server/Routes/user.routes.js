import { Router } from "express";
import upload from "../Config/multer.config.js";
import {
  updateUserResume,
  applyForJob,
  getUserData,
  getUserJobApplications,
} from "../Controllers/User.controller.js";

const router = Router();

// get user data
router.get("/user", getUserData);

// apply for a job
router.post("/apply", applyForJob);

// get applied jobs data
router.get("/applications", getUserJobApplications);

// update user profile
router.post("/update-resume", upload.single("resume"), updateUserResume);

export default router;
