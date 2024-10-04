import axios from "axios";
import express, { Request, Response } from "express";
import { User } from "../models/user";
import { Conversation } from "../models/conversation"; // Import the Conversation model
import auth from "../middleware/auth";

const conversationsRouter = express.Router();
const flaskApiUrl =
  process.env.FLASK_API_URL || "http://127.0.0.1:5000/predict";

conversationsRouter.get("/", auth, async (req: Request, res: Response) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate("conversations");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user.conversations);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve conversations" });
  }
});

// get conversation with id
conversationsRouter.get(
  "/:conversationId",
  auth,
  async (req: Request, res: Response) => {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation)
      return res
        .status(404)
        .send("The conversations with the given Id was not found");
    res.send(conversation);
  }
);

conversationsRouter.post("/", auth, async (req: Request, res: Response) => {
  const { title, initialMessage } = req.body;

  const userId = req.user._id;

  if (!title || !initialMessage || !initialMessage?.question) {
    return res
      .status(400)
      .json({ error: "Title and initial message are required" });
  }

  try {
    const question = initialMessage.question;

    const response = await axios.post(flaskApiUrl, { question });

    const existingConversation = await Conversation.findOne({ title });

    if (existingConversation) {
      existingConversation.messages.push({
        question: question,
        response: response.data.answer,
        createdAt: new Date(),
      });

      await existingConversation.save();

      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { conversations: existingConversation._id } },
        { new: true }
      );

      return res.status(200).json(existingConversation);
    } else {
      const newConversation = new Conversation({
        title,
        messages: [
          {
            question: question,
            response: response.data.answer,
            createdAt: new Date(),
          },
        ],
      });

      await newConversation.save();

      await User.findByIdAndUpdate(
        userId,
        { $push: { conversations: newConversation._id } },
        { new: true }
      );

      return res.status(201).json(newConversation);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create a new conversation" });
  }
});

// Add a new message to an existing conversation
conversationsRouter.post(
  "/:conversationId",
  auth,
  async (req: Request, res: Response) => {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    try {
      // Fetch the existing conversation
      const conversation = await Conversation.findById(
        req.params.conversationId
      );

      if (!conversation) {
        return res
          .status(404)
          .json({ error: "Conversation with the given ID was not found" });
      }

      // Call the Flask API for the response
      const response = await axios.post(flaskApiUrl, { question });

      conversation.messages.push({
        question,
        response: response.data.answer,
        createdAt: new Date(),
      });

      // Save the updated conversation
      await conversation.save();

      return res.status(200).json(conversation);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to add a message to the conversation" });
    }
  }
);

export default conversationsRouter;
