// file: /api/branches-status/route.ts (Next.js API Route)
import Branch from "@/models/Branch";
import PingResult from "@/models/result";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB();

  const branches = await Branch.find({});

  // For each branch, fetch only the latest ping result (sorted by checkedAt descending)
  const branchesWithStatus = await Promise.all(
    branches.map(async (branch) => {
      const latestPing = await PingResult.findOne({ ipAddress: branch.ipAddress })
        .sort({ checkedAt: -1 })
        .lean();

      return {
        id: branch._id.toString(),
        name: branch.branchName,
        coords: [parseFloat(branch.latitude), parseFloat(branch.longitude)],
        ipAddress: branch.ipAddress,
        status: latestPing ? (latestPing.alive ? "up" : "down") : "down",
        lastCheckedAt: latestPing ? latestPing.checkedAt : null,
      };
    })
  );

  return new Response(JSON.stringify(branchesWithStatus), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
