import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema(
     {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
          sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
          eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
     },
     { timestamps: true }
);

BookmarkSchema.index({ userId: 1, sessionId: 1 }, { unique: true });

export default mongoose.model("Bookmark", BookmarkSchema);
