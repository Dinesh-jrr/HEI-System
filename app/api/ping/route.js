import ping from "ping";
import { connectDB } from "@/lib/mongodb";
import PingResult from "@/models/result";

export async function POST(req) {
  await connectDB();
  const { ipAddress } = await req.json();

  if (!ipAddress) {
    return new Response(
      JSON.stringify({ error: "IP address is required" }),
      { status: 400 }
    );
  }

  try {
    const result = await ping.promise.probe(ipAddress, { timeout: 10, min_reply: 5 }); // timeout in seconds

    // Convert strings to numbers or null
    const latencyNum = result.avg === "unknown" ? null : Number(result.avg);
    const packetLossNum = Number(result.packetLoss);

    // Save latency as latency (not time) and convert packetLoss to number
    const pingData = await PingResult.create({
      ipAddress,
      host: result.host,
      alive: result.alive,
      latency: latencyNum,
      packetLoss: packetLossNum,
      // checkedAt will be auto set by schema default
    });

    // Prepare latency display value
    const latencyDisplay = latencyNum === null ? "timed out" : latencyNum;

    return new Response(
      JSON.stringify({
        alive: result.alive,
        status: result.alive ? "up" : "down",
        packetLoss: packetLossNum,
        ipAddress,
        latency: latencyDisplay,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
