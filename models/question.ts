import mongoose from "mongoose"
import { z } from "zod";

type Ineraction = {
    question: string;
}

const interactionSchema = new mongoose.Schema({
  question: { type: String, required: true }, 
  response: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

const Interaction = mongoose.model("Interaction", interactionSchema);

const validateInteraction = (interaction: Ineraction) => {
    const schema = z.object({
        question: z.string().min(1, { message: "question in required "}),
    });

    return schema.safeParse(interaction);
}

export { Interaction, validateInteraction };