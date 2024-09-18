import express, { Express } from "express";
import cors from "cors";
import routerHome from "../routes/home";
import questionRouter from "../routes/questions";
import mongoose from "mongoose";
import userRouter from "../routes/users";

const app: Express = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost/chatbot")
  .then(() => console.log("Connected to databse"))
  .catch((err) => console.log("Couldn't connect to Mongodb", err));

const home = routerHome;
const questions = questionRouter;
const users = userRouter;

app.use("/", home);
app.use("/api/questions", questions);
app.use("/api/users", users);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Listening on Port:${port}`);
});