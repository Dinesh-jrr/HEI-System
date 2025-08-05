"use client";

import { Branch } from "@/types";
import React, { useState } from "react";
import Marquee from "react-fast-marquee";
import { toast } from "sonner";

type HeaderProps = {
  onAddBranch: (branch: Branch) => void;
};
const Header = ({ onAddBranch }: HeaderProps) => {
  const [ip, setIp] = useState("");
  const [location, setLocation] = useState("");
  const [name,setName]=useState("");
  const [latitude,setLatitude]=useState("");
  const [longitude,setLongitude]=useState("");
  const [ipAddress,setIpAdrress]=useState("");
  const [response,setResponse]=useState(null);
  const [error, setError]=useState(null);
  const [speed, setSpeed] = useState(50);
  const [branchStatuses, setBranchStatuses] = useState<Branch[]>([]);


  const updates = [
    "Ping sent to all users",
    "Kathmandu map updated",
    "New marker added in Pokhara",
    "Server restarted successfully",
    "User feedback received"
  ];

  
 


  const handleAddIp = async () => {
  const latNum = Number(latitude);
  const lngNum = Number(longitude);

  if (!ip || !name || !location || isNaN(latNum) || isNaN(lngNum)) {
    toast.error("All fields are required and latitude/longitude must be valid numbers");
    return;
  }

  try {
    const res = await fetch("/api/branch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ipAddress: ip, branchName: name, location, latitude: latNum, longitude: lngNum }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setResponse(null);
      toast.error(data.error || "Failed to add IP");
    } else {
      setResponse(data);
      setError(null);

      // Second: Immediately ping the IP
    const pingRes = await fetch("/api/ping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ipAddress: data.ipAddress }),
    });
    const pingData = await pingRes.json();
      const normalizedBranch: Branch = {
  id: data._id || data.id,
  name: data.branchName || name,
  coords: [data.latitude || latNum, data.longitude || lngNum],
  status: pingData.status || "down",
  ipAddress: data.ipAddress || ip,
  history: data.history || [], // probably always there or default []
  // pingHistory omitted since optional
};


onAddBranch(normalizedBranch);
toast.success("IP added successfully");

setBranchStatuses(prev => [normalizedBranch, ...prev]);
         
      // Clear inputs
      setIp("");
      setName("");
      setLocation("");
      setLatitude("");
      setLongitude("");
    }
  } catch (err) {
    setError((err as any).message || "Fetch error");
    toast.error((err as any).message || "Fetch error");
  }
};


  const handlePing=()=>{
    toast.success("All IP pings Successfully!");
  };

  const handleAutoPing=()=>{
    toast.success("Auto IP started Successfully!");
  }

  const handleStopPing=()=>{
      toast.success("IP stopped Successfully!");
  }

  const handleClearPing=()=>{
      toast.success("All IP clear Successfully!");
  }

   
  return (
    <header className="text-white mt-10 rounded-lg flex flex-col  gap-10 items-center justify-center">
      <div className="flex gap-6 justify-center items-center">
        <input
        type="text"
        placeholder="Enter IP Address"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        className="p-2 rounded text-black border-2 border-[#199ccd]"
        
      />
      <input
        type="text"
        placeholder="Name of branch"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 rounded text-black border-2 border-[#199ccd] "
      />
      <input
       type="text"
       placeholder="Enter Location"
       value={location}
       onChange={(e)=>setLocation(e.target.value)}
       className="p-2 rounded text-black border-2 border-[#199ccd]"
       />
       <input
        type="text"
        placeholder="Latitude"
        value={latitude}
        onChange={(e)=>setLatitude(e.target.value)}
        className="p-2 rounded text-black border-2 border-[#199ccd]"
        />
        <input 
         type="text"
         placeholder="Enter Longitude"
         value={longitude}
         onChange={(e)=>setLongitude(e.target.value)}
         className="p-2 rounded text-black border-2 border-[#199ccd]"
         />
      <button
  onClick={handleAddIp}
  className="border-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700">
  Add IP
</button>
      </div>
      {/* Buttons for the pings */}
    <div className="flex gap-10 justify-center items-center">
    <button onClick={handlePing}className="border-2 bg-green-500 hover:bg-green-700 rounded px-4 py-2">Ping All</button>
    <button onClick={handleAutoPing} className="border-2 bg-green-700 hover:bg-green-500 rounded px-4 py-2">Start Auto Ping(Every 5 mins)</button>
    <button onClick={handleStopPing} className="border-2 bg-red-500 hover:bg-red-700 rounded px-4 py-2">Stop Auto Ping</button>
    <button onClick={handleClearPing} className="border-2 bg-red-700 hover:bg-red-500 rounded px-4 py-2">Clear All IP</button>
      </div>  
    
    <div className="bg-green-700 text-white py-2">
      <Marquee pauseOnHover={true} speed={speed} gradient={false}>
        {updates.map((update, index) => (
          <span key={index} className="mx-8 text-lg">
            {update}
          </span>
        ))}
      </Marquee>
    </div>
    </header>
  );
};

export default Header;
