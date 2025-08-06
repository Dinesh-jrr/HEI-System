import React, { useState } from "react";

type Branch = {
  name: string;
  status: "up" | "down";
};

const branches: Branch[] = [
  { name: "Hattisar", status: "up" },
  { name: "Babar Mahal", status: "down" },
  { name: "Surkhet", status: "up" },
  { name: "Surkhet", status: "up" },
  { name: "Surkhet", status: "down" },
  { name: "Pokhara", status: "up" },
  { name: "Surkhet", status: "down" },
  { name: "Hetauda", status: "up" },
  { name: "Surkhet", status: "down" },
  { name: "Surkhet", status: "up" },
  { name: "Surkhet", status: "up" },
];

const RightSidebar: React.FC = () => {
  const [search, setSearch] = useState<string>("");

  // Filter branches based on search text
  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[15%] text-white p-4 rounded-lg h-full overflow-y-auto shadow-lg">
      <h3 className="text-[#009acc] text-[27px] mb-3">Our Branches</h3>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search branch..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-1 mb-4 rounded-md border-2 border-white text-white focus:outline-none focus:ring-2 focus:ring-[#009acc]"
      />

      <ul className="space-y-3">
        {filteredBranches.length > 0 ? (
          filteredBranches.map((branch, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 rounded-md border border-[#009acc] hover:border-2 hover:border-white transition"
            >
              <span className="text-[20px]">{branch.name}</span>
              <span
                className={`w-3 h-3 rounded-full ${
                  branch.status === "up" ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
            </li>
          ))
        ) : (
          <li className="text-red-700 text-sm text-center">No branches found</li>
        )}
      </ul>
    </div>
  );
};

export default RightSidebar;
