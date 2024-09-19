import express, { Request, Response } from "express";
import { User } from "../models/user";
import _ from "lodash";
import bcrypt from "bcrypt";
import { z } from "zod";
import jsonwentoken from "jsonwebtoken";
import config from "config";

type Users = {
    name: string,
    password: string
}

const authRouter = express.Router();

authRouter.post("/", async (req: Request, res: Response) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).json({ errors: error.errors });

  let user = await User.findOne({ email: req.body.email }); // returns a promise we await it
  if (!user) return res.status(400).send("Invalid email and password");

  // compare the password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send("Invalid email and password");

  const token = jsonwentoken.sign({ _id: user._id}, config.get('jwtPrivateKey'));
  
  res.send(token);
}); 

const validate = (user: Users) => {
  const schema = z.object({
    email: z.string().email().min(5, { message: "email is required" }).max(255),
    password: z.string().min(5, { message: "email is required" }).max(255),
  });

  return schema.safeParse(user);
};

export default authRouter;
