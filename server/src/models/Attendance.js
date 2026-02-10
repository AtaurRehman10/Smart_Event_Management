import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
     {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
          sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
          eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
          status: { type: String, default: "attended" }, // attended/no-show
     },
     { timestamps: true }
);

export default mongoose.model("Attendance", AttendanceSchema);
