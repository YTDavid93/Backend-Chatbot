import mongoose, { Model } from "mongoose";
import { z } from "zod";
import jsonwebtoken from "jsonwebtoken";
import config from "config";

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  generateAuthToken: () => string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email:{
    type: String,
    required: true,
    minlength: 5, 
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5, 
    maxlength: 1024
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jsonwebtoken.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
}

const User: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);

const validateUser = (user: { name: string; email: string; password: string}) => {
    const schema = z.object({
      name: z.string().min(1, { message: "name is required" }).max(50),
      email: z.string().email().min(5, { message: "email is required" }).max(255),
      password: z.string().min(5, { message: "email is required" }).max(255),
    });

    return schema.safeParse(user);
}

export { User, validateUser };