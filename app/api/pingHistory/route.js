import { connectDB } from "@/lib/mongodb";
import PingResult from "@/models/result";

export async function GET() {
  await connectDB();

  const pingHistory = await PingResult.find({})
    .sort({ checkedAt: -1 })
    .limit(100)
    .lean();

  return new Response(JSON.stringify(pingHistory), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
