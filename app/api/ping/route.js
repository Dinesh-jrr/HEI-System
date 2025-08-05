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
    const result = await ping.promise.probe(ipAddress, { timeout: 50000 }); // timeout in seconds

    // Save result in DB (optional)
    const pingData = await PingResult.create({
      ipAddress,
      host: result.host,
      alive: result.alive,
      time: result.time,
    });

    // Return JSON response
    return new Response(
      JSON.stringify({
        alive: result.alive,
        status: result.alive ? "up" : "down",
        ipAddress,
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
