"use client";

import React from "react";
import DarkModeToggle from "./DarkMode";

const Navbar = () => {
  return (
    <nav className="text-white  py-2 flex flex-row  items-center justify-center gap-10 sticky-top z-0 shadow-[0_8px_6px_-2px_rgba(0,0,0,0.3)]" style={{ backgroundColor: "#009acc" }}>
{/*       
      <div className="flex items-center w-[200px] gap-2   flex justify-center">
        <img src=" " alt="Logo" className="h-10 w-10 rounded-full" />
        <h1 className="text-[25px] font-bold">HEI</h1>
      </div>
      
        <div className=""><h2 className="text-[25px] w-[800px] text-center text-bold">HEI NOC DASHBOARD</h2>
        </div>
        <div>
        </div>
        
        <div className=" w-[200px] flex justify-center">
          <DarkModeToggle></DarkModeToggle>
        </div> */}
    </nav>
  );
};

export default Navbar;
