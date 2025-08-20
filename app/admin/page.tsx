"use client";

import { Branch } from "@/types";
import React, { useState } from "react";
import { toast } from "sonner";

const Admin = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [ip, setIp] = useState("");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

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
        toast.error(data.error || "Failed to add IP");
      } else {
        setBranches(prev => [data, ...prev]); // <-- store branch here
        toast.success("IP added successfully");

        setIp("");
        setName("");
        setLocation("");
        setLatitude("");
        setLongitude("");
      }
    } catch (err) {
      toast.error((err as any).message || "Fetch error");
    }
  };
   
  return (
    <header className="text-white mt-10 rounded-lg flex flex-col  gap-10 items-center justify-center">
      <div className="flex gap-6 justify-center items-center">
        <input
        type="text"
        placeholder="Enter IP Address"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        className="p-2 rounded text-black border-2 border-[#199ccd] bg-gray-300"
        
      />
      <input
        type="text"
        placeholder="Name of branch"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 rounded text-black border-2 border-[#199ccd] bg-gray-300 "
      />
      <input
       type="text"
       placeholder="Enter Location"
       value={location}
       onChange={(e)=>setLocation(e.target.value)}
       className="p-2 rounded text-black border-2 border-[#199ccd] bg-gray-300"
       />
       <input
        type="text"
        placeholder="Latitude"
        value={latitude}
        onChange={(e)=>setLatitude(e.target.value)}
        className="p-2 rounded text-black border-2 border-[#199ccd] bg-gray-300"
        />
        <input 
         type="text"
         placeholder="Enter Longitude"
         value={longitude}
         onChange={(e)=>setLongitude(e.target.value)}
         className="p-2 rounded text-black border-2 border-[#199ccd] bg-gray-300"
         />
      <button
  onClick={handleAddIp}
  className="border-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700 bg-gray-500">
  Add IP
</button>
      </div>
      {/* Buttons for the pings */}
    {/* <div className="flex gap-10 justify-center items-center"> */}
    {/* <button onClick={handlePing}className="border-2 bg-green-500 hover:bg-green-700 rounded px-4 py-2">Ping All</button> */}
    {/* <button onClick={handleAutoPing} className="border-2 bg-green-700 hover:bg-green-500 rounded px-4 py-2">Start Auto Ping(Every 5 mins)</button> */}
    {/* <button onClick={handleStopPing} className="border-2 bg-red-500 hover:bg-red-700 rounded px-4 py-2">Stop Auto Ping</button> */}
    {/* <button onClick={handleClearPing} className="border-2 bg-red-700 hover:bg-red-500 rounded px-4 py-2">Clear All IP</button> */}
      {/* </div> */}
    
    {/* <div className="bg-green-700 text-white py-2">
      <Marquee pauseOnHover={true} speed={speed} gradient={false}>
        {updates.map((update, index) => (
          <span key={index} className="mx-8 text-lg">
            {update}
          </span>
        ))}
      </Marquee>
    </div> */}
    </header>
  );
};

export default Admin;
