"use client";

import { Branch } from "@/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Ping = {
  alive: boolean;
  checkedAt: string;
};



type Props = {
  selectedBranch: Branch | null; // <-- now allows null
};

const RightSide: React.FC<Props> = ({ selectedBranch }) => {
  
   const [pingHistory, setPingHistory] = useState<Ping[]>([]);

   // Fetch history whenever branch changes
  useEffect(() => {
    if (!selectedBranch) {
      setPingHistory([]);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/${selectedBranch.id}/pingHistory`);
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setPingHistory(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load ping history");
      }
    };

    fetchHistory();
  }, [selectedBranch]);
  
  if (!selectedBranch) {
    return (
      <div className="w-[15%] bg-gray-200 p-4 rounded-lg h-full flex items-top justify-center text-gray-500">
        No branch selected
      </div>
    );
  }

  // const pingHistory = Array.isArray(selectedBranch.history)
  //   ? selectedBranch.history
  //   : [];
  const segments = pingHistory.slice(0, 10);

  return (
    <div className="w-[15%] bg-gray-200 p-4 rounded-lg h-full">
      <h2 className="text-[15px] font-semibold text-black mb-1">
        Updates of each branch
      </h2>
      <br />
      <div className="h-[300px] w-[200px] border-2 border-green-600 rounded-lg p-4 shadow-md bg-white relative">
        <p className="text-[15px] font-semibold text-gray-700 mb-1">
          📍 Name of Branch
        </p>
        <p className="text-sm text-gray-600 mb-1">{selectedBranch.name}</p>
        <p className="text-sm text-gray-600 mb-3">
          Location: {selectedBranch.coords.join(", ")}
        </p>
        <p className="text-sm text-gray-600 mb-3">
          IP Address: {selectedBranch.ipAddress}
        </p>
        <p className="text-sm text-gray-600 mb-3">Status:</p>

        {/* Segmented Status Bar */}

  <div className="flex items-center gap-3">
    <div className="flex w-full gap-1 h-4 rounded overflow-hidden">
        <div className="flex w-full gap-1 h-4 rounded overflow-hidden">
        {segments.map((ping, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-colors duration-500 ${
              ping.alive ? "bg-green-500" : "bg-red-500"
            }`}
            title={ping.checkedAt ? new Date(ping.checkedAt).toLocaleString() : "No data"}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {segments.length}/10
      </span>
    
</div>
  </div>



          {/* Status Label */}
          {/* <span
            className={`text-sm font-bold px-2 py-1 rounded ${
              selectedBranch.status === "up"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          > */}
            {selectedBranch.status === "down" && (
              <div className="absolute -top-4 left-0 right-0 bg-red-600 text-white text-center text-sm font-semibold py-5 px-4 animate-pulse rounded-t-lg shadow-lg">
                ⚠{" "}
                <span className="ml-2">
                  Branch <strong>"{selectedBranch.name}"</strong> is{" "}
                  <strong>DOWN</strong>
                </span>
              </div>
            )}
          
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6 items-center">
          <button
            onClick={() => toast.success("Edit button clicked Successfully!")}
            className="border border-green-600 bg-green-500 text-white text-[15px] px-2 py-1 rounded-sm hover:bg-green-700 transition"
          >
            Edit
          </button>

          <button
            onClick={() => toast.success("Add IP button clicked Successfully!")}
            className="border border-green-600 bg-blue-500 text-white text-[15px] px-2 py-1 rounded-sm hover:bg-green-700 transition"
          >
            View
          </button>
        </div>
      </div>
  );
};

export default RightSide;
