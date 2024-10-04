import mongoose, { Document, Model } from "mongoose";

interface Message {
  question: string;
  response: string;
  createdAt: Date;
}

interface ConversationDocument extends Document {
  title: string;
  messages: Message[];
  createdAt: Date;
}

const messageSchema = new mongoose.Schema({
  question: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});

const Conversation: Model<ConversationDocument> =
  mongoose.model<ConversationDocument>("Conversation", conversationSchema);

export { Conversation };
