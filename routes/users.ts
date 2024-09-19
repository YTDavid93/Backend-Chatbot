import express, { Request, Response } from "express";
import { User, validateUser } from "../models/user";
import _ from "lodash";
import bcrypt from "bcrypt";

const userRouter = express.Router();

userRouter.post("/", async (req: Request, res: Response) => {
  const { error } = validateUser(req.body);

  if (error) return res.status(400).json({ errors: error.errors });

  let user = await User.findOne({ email: req.body.email }); // returns a promise we await it
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken().trim();

  res.header('x-auth-token', token).send(_.pick(user, ["_id", "name", "email"]));
});

export default userRouter;
