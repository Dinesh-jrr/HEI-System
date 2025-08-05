"use client";

import React from "react";
import DarkModeToggle from "./DarkMode";

const Navbar = () => {
  return (
    <nav className="bg-green-600 text-white px-15 py-6  flex items-center justify-between sticky-top z-0" style={{ backgroundColor: "#199ccd" }}>
      {/* Left side: Logo */}
      <div className="flex items-center gap-2">
        <img src=" " alt="Logo" className="h-10 w-10 rounded-full" />
        <h1 className="text-xl font-bold">HEI</h1>
      </div>
      {/* middle section */}
        <div className="flex flex-col justify-center items-center gap-2"><h1 className="text-5xl text-black text-bold">Himalayan Everest Insurance Company</h1>
        <h2 className="text-[25px] text-black">NOC updates of every branches</h2>
        </div>
        <div>
        </div>
        {/* right section  */}
        <div>
          <DarkModeToggle></DarkModeToggle>
        </div>
    </nav>
  );
};

export default Navbar;
