import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTION = {
      dbName: "authontication",
    };
    await mongoose.connect(DATABASE_URL, DB_OPTION);
    console.log("DB Connect Succesfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
