import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yushinbox:O3XmyKyqPC49aOHN@blogclaster.wbahp.mongodb.net/posts?retryWrites=true&w=majority"
    );
    console.log("MongoDB blogclaster connected");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
