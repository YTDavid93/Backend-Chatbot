import axios from "axios";
import express, { Request, Response } from "express";
import { User } from "../models/user";
import auth from "../middleware/auth";

const questionRouter = express.Router();
const flaskApiUrl =
  process.env.FLASK_API_URL || "http://127.0.0.1:5000/predict";

questionRouter.post("/", auth, async (req: Request, res: Response) => {
  const { userId, question } = req.body;

  if (!userId || !question)
    return res.status(400).json({ error: "Question and UserId is requied" });

  try {
    const response = await axios.post(flaskApiUrl, { question });

    const updatedUser = await User.findOneAndUpdate(
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

    const lastInteraction =
      updatedUser.interactions[updatedUser.interactions.length - 1];

    return res.json({
      answer: response.data.answer,
      interactionId: lastInteraction?._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to get a response from the Python API" });
  }
});

questionRouter.get("/", auth, async (req: Request, res: Response) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId, "interactions");
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json(user.interactions);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve chat history" });
  }
});

export default questionRouter;
