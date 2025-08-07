// import { Branch } from "@/types";
import React, { useState } from "react";

type Branch = {
  name: string;
  location:string;
  status: "up" | "down";
  coords: [number, number];
  ipAddress: string;
  segments: { alive: boolean; checkedAt?: string }[];
};

const branches: Branch[] = [
  {
    name:"HO",
    location: "Hattisar",
    status: "up",
    coords: [27.7134, 85.3156],
    ipAddress: "192.168.1.10",
    segments: Array(10)
      .fill(null)
      .map(() => ({
        alive: Math.random() > 0.2, // 80% chance it's up
        checkedAt: new Date().toISOString(),
      })),
  },
  {
    name:"Kathmandu",
    location: "Babar Mahal",
    status: "down",
    coords: [27.6942, 85.3303],
    ipAddress: "192.168.1.11",
    segments: Array(10)
      .fill(null)
      .map(() => ({
        alive: Math.random() > 0.5,
        checkedAt: new Date().toISOString(),
      })),
  },
  {
    name:"Surkhet",
    location: "Surkhet",
    status: "up",
    coords: [28.6, 81.6333],
    ipAddress: "192.168.1.12",
    segments: Array(10)
      .fill(null)
      .map(() => ({
        alive: Math.random() > 0.3,
        checkedAt: new Date().toISOString(),
      })),
  },
  

];

const RightSidebar: React.FC = () => {
  const [search, setSearch] = useState<string>("");

  // Filter branches based on search text
  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[15%] text-white p-4 rounded-lg h-full overflow-y-auto your-scrollbar-class shadow-lg">
      {/* <h3 className="text-[#009acc] text-[25px] mb-3 pl-5">Our Branches</h3> */}

      {/* Search Bar
      <input
        type="text"
        placeholder="Search branch..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-1 mb-4 rounded-md border-2 border-white text-white focus:outline-none focus:ring-2 focus:ring-[#009acc]"
      /> */}

      <ul className="space-y-3">
        {filteredBranches.length > 0 ? (
          filteredBranches.map((branch, index) => (
            <li
              key={index}
              className="h-[200px] w-[200px] border-2 border-[#009acc] rounded-lg p-4 shadow-md  relative cursor-pointer hover:shadow-lg transition"
              onClick={(e) => {}}
            >
              <p className="text-[15px] font-semibold text-white mb-1">
                📍 {branch.name}
              </p>
              <p className="text-sm text-white mb-3">
                Location:  <span className="text-gray-400">{branch.coords?.join(", ") || "N/A"}</span>
              </p>
              <p className="text-sm text-white mb-3">
                IP Address:<span className="text-gray-400">{branch.ipAddress || "N/A"}</span>
              </p>
              <p className="text-sm text-white mb-3">Status:</p>

              {/* Segmented Status Bar */}
              <div className="flex items-center gap-3">
                <div className="flex w-full gap-1 h-4 rounded overflow-hidden">
                  {branch.segments?.map((ping, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm transition-colors duration-500 ${
                        ping.alive ? "bg-green-500" : "bg-red-500"
                      }`}
                      title={
                        ping.checkedAt
                          ? new Date(ping.checkedAt).toLocaleString()
                          : "No data"
                      }
                    />
                  ))}
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="text-red-700 text-sm text-center">
            No branches found
          </li>
        )}
      </ul>
    </div>
  );
};

export default RightSidebar;
