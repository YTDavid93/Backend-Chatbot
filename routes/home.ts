import express, { Request, Response } from "express";

const routerHome = express.Router();

routerHome.get("/", (req: Request, res: Response) => {
  res.send("Express + Typescript server");
});

export default routerHome;
