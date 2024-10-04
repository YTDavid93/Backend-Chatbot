import express, { Express } from "express";
import cors from "cors";
import routerHome from "../routes/home";
import questionRouter from "../routes/questions";
import mongoose from "mongoose";
import userRouter from "../routes/users";
import authRouter from "../routes/auth";
import config from "config";
import conversationsRouter from "../routes/conversations";

const app: Express = express();
app.use(express.json());
app.use(
  cors({
    exposedHeaders: ["x-auth-token"],
  })
);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/chatbot")
  .then(() => console.log("Connected to databse"))
  .catch((err) => console.log("Couldn't connect to Mongodb", err));

const home = routerHome;
const questions = questionRouter;
const users = userRouter;
const auth = authRouter;
const conversations = conversationsRouter;

app.use("/", home);
app.use("/api/questions", questions);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/conversations", conversations);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Listening on Port:${port}`);
});
