// models/PingResult.js
import mongoose from "mongoose";

const PingResultSchema = new mongoose.Schema(
  {
    ipAddress: { type: String, required: true },
    host: { type: String },
    alive: { type: Boolean, required: true },
    time: { type: Number }, // response time in ms
    checkedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.PingResult ||
  mongoose.model("PingResult", PingResultSchema);
