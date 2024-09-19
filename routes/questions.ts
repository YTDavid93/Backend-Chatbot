import axios from "axios";
import express, { Request, Response } from "express";
import { Interaction } from "../models/question";
import auth from "../middleware/auth"

const questionRouter = express.Router();
const flaskApiUrl = process.env.FLASK_API_URL || "http://127.0.0.1:5000/predict";

questionRouter.post("/", auth, async (req: Request, res: Response) => {
  const { question } = req.body; 

  if (!question) return res.status(400).json({ error: "Question is required" });

  try {
    const response = await axios.post(
      flaskApiUrl,
      { question },
    );

    await Interaction.create({
      question,
      response: response.data.answer, 
    });

    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to get a response from the Python API" });
  }
});

export default questionRouter;
