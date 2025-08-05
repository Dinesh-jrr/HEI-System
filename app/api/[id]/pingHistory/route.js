import Branch from "@/models/Branch";
import PingResult from "@/models/result";
import { connectDB } from "@/lib/mongodb";

/**
 * @param {Request} req
 * @param {{ params: { id: string } }} context
 */
export async function GET(req, context) {
  await connectDB();
    const {params} =await context;
  const branchId = params.id;

  const branch = await Branch.findById(branchId);
  if (!branch) {
    return new Response(JSON.stringify({ error: "Branch not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const pingHistory = await PingResult.find({ ipAddress: branch.ipAddress })
    .sort({ checkedAt: -1 })
    .limit(10)
    .lean();

  return new Response(JSON.stringify(pingHistory), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
