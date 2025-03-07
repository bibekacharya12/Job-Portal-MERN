import mongoose from "mongoose";

// function to connect to the mongodb database
const connectDb = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/job-portal`
    );
    console.log("Database connected");
  } catch (error) {
    console.log("Error while connecting to database", error.message);
    process.exit(1);
  }
};

export default connectDb;
