import axios from "axios";
import express, { Request, Response } from "express";
import { Interaction } from "../models/question";
import { User } from "../models/user"
import auth from "../middleware/auth";

const questionRouter = express.Router();
const flaskApiUrl = process.env.FLASK_API_URL || "http://127.0.0.1:5000/predict";

questionRouter.post("/", auth, async (req: Request, res: Response) => {
  const { userId, question } = req.body;

  if (!userId || !question) return res.status(400).json({ error: "Question and UserId is requied" });

  try {
    const response = await axios.post(flaskApiUrl, { question });

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          interactions: {
            question,
            response: response.data.answer,
            createdAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    return res.json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to get a response from the Python API" });
  }

});

export default questionRouter;
