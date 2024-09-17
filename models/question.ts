import mongoose from "mongoose"

const interactionSchema = new mongoose.Schema({
  question: { type: String, required: true }, 
  response: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

const Interaction = mongoose.model("Interaction", interactionSchema);

export { Interaction };