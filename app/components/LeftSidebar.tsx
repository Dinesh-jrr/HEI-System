"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Globe } from "lucide-react";
import { format } from "date-fns";

interface PingLog {
  ipAddress: string;
  latency: number;
  packetLoss: string;
  checkedAt?: string;
  time?: string;
}

export default function LeftSidebar() {
  const [logs, setLogs] = useState<PingLog[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("http://localhost:3000/api/pingHistory");
        if (!res.ok) {
          console.error("Failed to fetch logs", await res.text());
          return;
        }
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    }
    fetchLogs();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Start scroll at the bottom when logs change
    container.scrollTop = container.scrollHeight;

    const scrollInterval = setInterval(() => {
      if (!container) return;

      // Scroll up 1px
      container.scrollTop -= 1;

      // If reached top, reset to bottom
      if (container.scrollTop <= 0) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);

    return () => clearInterval(scrollInterval);
  }, [logs]);

  return (
    <div className="w-[23%] text-white rounded-lg h-full flex flex-col items-center shadow-xl ">
      <div className="flex justify-center items-center py-6">
        <Image src="/logo.png" alt="logo" width={70} height={70} />
        <p className="font-bold">Himalayan Everest Insurance</p>
      </div>

      <div className="w-full px-4 py-4 flex flex-col gap-3 overflow-y-auto ">
        <h3 className="text-[#009acc] text-[25px]">Connection Logs</h3>
        <div
          ref={scrollRef}
          className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-2 your-scrollbar-class w-full"
          // Removed pause on hover to keep continuous scroll
        >
          {logs.map((log, index) => (
            <div
              key={`${log.ipAddress}-${index}`}
              className="flex items-start gap-3 p-3 rounded-md cursor-pointer transition"
            >
              <div className="bg-[#009acc] h-8 w-10 rounded-full flex items-center justify-center">
                <Globe className="text-black" size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] ">
                  Pinging <strong>{log.ipAddress}</strong> with latency{" "}
                  <strong>{log.latency} ms</strong>
                </span>
                <span className="text-xs text-gray-400 gap-1 flex justify-between w-full">
                  <span>
                    {log.checkedAt || log.time
                      ? format(
                          new Date(log.checkedAt || log.time || ""),
                          "dd MMM yyyy, hh:mm a"
                        )
                      : ""}
                  </span>
                  <span className="text-[#09aacc]">
                    Loss: <strong>{log.packetLoss}</strong>
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
