import { connectDB } from "@/lib/mongodb";
import Branch from "@/models/Branch";
import ping from "ping";

export async function POST(req) {
  await connectDB();
  const { ipAddress, branchName, location, latitude, longitude } = await req.json();

  if (!ipAddress || !branchName || !location || !latitude || !longitude) {
    return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
  }

  const existingBranch = await Branch.findOne({ ipAddress });
  if (existingBranch) {
    return new Response(JSON.stringify({ error: "Branch with this IP already exists" }), { status: 409 });
  }

  let status = "down";
  let responseTime = null;

  try {
    const result = await ping.promise.probe(ipAddress, { timeout: 10, min_reply: 3 });
    status = result.alive ? "up" : "down";
    responseTime = result.time || null;
  } catch {
    status = "down";
  }

  // Create branch with status from ping
  const newBranch = await Branch.create({
    ipAddress,
    branchName,
    location,
    latitude,
    longitude,
    status,
  });


  return new Response(
    JSON.stringify({ branch: newBranch }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
}



// //get all branches

// export async function GET(req) {
//   await connectDB();
//   try {
//     const branches = await Branch.find({});
//     return new Response(JSON.stringify(branches), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: "Failed to fetch branches" }), {
//       status: 500,
//     });
//   }
// }


export async function DELETE(req) {
  await connectDB();

  try {
    // Parse JSON body to get id
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Missing branch id" }),
        { status: 400 }
      );
    }

    const deletedBranch = await Branch.findByIdAndDelete(id);

    if (!deletedBranch) {
      return new Response(
        JSON.stringify({ message: "Branch not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Branch deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting branch:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting branch" }),
      { status: 500 }
    );
  }
}


export async function GET(req) {
  await connectDB();

  try {
    const branches = await Branch.find({});

    return new Response(
      JSON.stringify(branches),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("GET /api/branches error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch branches" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


