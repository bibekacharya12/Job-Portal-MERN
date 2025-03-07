import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import "./Config/instrument.js";
import connectDb from "./Config/dbConnection.config.js";
import { clerkWebhooks } from "./Controllers/WebHooks.controller.js";
import companyRoutes from "./Routes/company.routes.js";
import jobRoutes from "./Routes/job.routes.js";
import userRoutes from "./Routes/user.routes.js";
import connectCloudinary from "./Config/cloudinary.config.js";
import { clerkMiddleware } from "@clerk/express";

// dotenv configuration
dotenv.config();

// connecting to database
await connectDb();
await connectCloudinary();

// initialize express server;
const app = express();

// middlewares
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => {
  res.send("api is working");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.post("/webhooks", clerkWebhooks);

app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

// PORT from .env file
const PORT = process.env.PORT || 5000;

// sentry should be initialized after all the routes and before any other error handling middlewares.
Sentry.setupExpressErrorHandler(app);

// port on which server will run
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
