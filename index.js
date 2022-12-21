import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/usersRoute.js";
const app = express();

// MiddleWare
app.use(cors());
app.use(express.json());
app.use("/users", router);

// Access to env Varibles
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// DB Connection
connectDB(DATABASE_URL);

app.listen(port, () => {
  console.log(`Server is starts on PORT : ${port}`);
});
