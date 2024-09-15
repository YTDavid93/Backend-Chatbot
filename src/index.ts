import express, { Express } from "express";
import cors from "cors";
import routerHome from "../routes/home";
import questionRouter from "../routes/questions";

const app: Express = express();
app.use(express.json());
app.use(cors());

const home = routerHome;
const questions = questionRouter;

app.use("/", home);
app.use("/api/questions", questions);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Listening on Port:${port}`);
});