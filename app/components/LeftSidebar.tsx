"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Globe } from "lucide-react";

export default function LeftSidebar() {
  const [logs] = useState([
    {
      id: 1,
      title: "MVPower CCTV DVR Remote Code Injection",
      time: "10:47:21",
      from: "Hattisar",
      to: "Surkhet",
    },
    {
      id: 2,
      title: "Mcp-remote Command Injection",
      time: "10:47:21",
      from: "Head Office",
      to: "Biratnagar",
    },
    {
      id: 3,
      title: "Memcached Web-Servers Network Attack",
      time: "10:47:20",
      from: "Hetauda",
      to: "Lalitpur",
    },
    {
      id: 4,
      title: "Generic IoT Vulnerabilities",
      time: "10:47:20",
      from: "Pokhara",
      to: "Birgunj",
    },{
      id: 5,
      title: "MVPower CCTV DVR Remote Code Injection",
      time: "10:47:21",
      from: "Hattisar",
      to: "Surkhet",
    },{
      id: 6,
      title: "MVPower CCTV DVR Remote Code Injection",
      time: "10:47:21",
      from: "Hattisar",
      to: "Surkhet",
    },{
      id: 7,
      title: "MVPower CCTV DVR Remote Code Injection",
      time: "10:47:21",
      from: "Hattisar",
      to: "Surkhet",
    },{
      id: 8,
      title: "MVPower CCTV DVR Remote Code Injection",
      time: "10:47:21",
      from: "Hattisar",
      to: "Surkhet",
    },{
      id: 9,
      title: "MVPower CCTV DVR Remote Code Injection",
      time: "10:47:21",
      from: "Hattisar",
      to: "Surkhet",
    },{
      id: 10,
      title: "MVPower CCTV DVR Remote Code Injection",
      time: "10:47:21",
      from: "Hattisar",
      to: "Surkhet",
    },
    {
      id: 11,
      title: "MVPower CCTV DVR Remote Code Injection",
      time: "10:47:21",
      from: "Hattisar",
      to: "Surkhet",
    },
  ]);
  const scrollRef=useRef<HTMLDivElement>(null);
  const [isPaused,setIsPaused]=useState(false);

// Auto-scroll logic
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (scrollRef.current && !isPaused) {
        const container = scrollRef.current;
        container.scrollTop += 1; // scroll speed

        // Reset when reaching bottom
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          container.scrollTop = 0;
        }
      }
    }, 50); // adjust speed

    return () => clearInterval(scrollInterval);
  }, [isPaused]);
  
  return (
    <div className="w-[20%] text-white rounded-lg h-full flex flex-col items-center shadow-xl ">
      {/* Logo */}
      <div className="flex justify-center items-center py-6">
        <Image src="/logo.png" alt="logo" width={70} height={70} />
        <p className="font-bold">Himalayan Everest Insurance</p>
      </div>

      {/* Logs Section */}
      <div className="w-full px-4 py-4 flex flex-col gap-3 overflow-y-auto ">
        <h3 className="text-[#009acc] text-[25px]">Connection Logs</h3>
        <div 
        ref={scrollRef}
        onMouseEnter={()=>setIsPaused(true)}
        onMouseDown={()=>setIsPaused(false)}
        className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-2 your-scrollbar-class ">

        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3 rounded-md cursor-pointer transition"
          >
            <div className="bg-[#009acc]  h-8 w-10 rounded-full flex items-center justify-center">
              <Globe className="text-black" size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] ">{log.title}</span>
              <span className="text-xs text-gray-400">
                {log.time} <span className="text-[#009acc] ">{log.from}</span> →{" "}
                <span className="text-[#009acc] ">{log.to}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>

  );
}
