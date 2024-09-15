import express, { Express, Request, Response } from "express";
import routerHome from "../routes/home";

const app: Express = express();
app.use(express.json());

const home = routerHome;

app.use("/", home);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Listening on Port:${port}`);
});