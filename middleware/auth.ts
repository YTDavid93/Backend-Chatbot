import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
import config from "config";

const auth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jsonwebtoken.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

export default auth;