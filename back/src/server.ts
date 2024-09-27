import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { apiKeyRouter, todoRouter, userRouter } from "./routes";
import { connectDB } from "./utils";


dotenv.config();

const app: Application = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/todos", todoRouter);
app.use("/api/auth", userRouter);
app.use("/api/key", apiKeyRouter);

connectDB();


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
