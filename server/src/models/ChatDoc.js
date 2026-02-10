import mongoose from "mongoose";

const ChatDocSchema = new mongoose.Schema(
     {
          eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
          sourceType: { type: String, default: "faq" }, // faq/session/venue/speaker
          title: String,
          text: { type: String, required: true },
          embedding: { type: [Number], default: [] }, // vector (384 dims for MiniLM)
     },
     { timestamps: true }
);

export default mongoose.model("ChatDoc", ChatDocSchema);
