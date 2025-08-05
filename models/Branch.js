// models/Branch.js
import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true },
  branchName: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Branch || mongoose.model("Branch", BranchSchema);
