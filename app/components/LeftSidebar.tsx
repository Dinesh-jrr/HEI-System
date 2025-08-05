import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Branch } from "@/types";

type LeftSidebarProps = {
  branchStatuses: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch) => void;
};

export default function LeftSidebar({
  branchStatuses,
  selectedBranch,
  setSelectedBranch,
}: LeftSidebarProps) {
  // Local state so we can modify the list without touching props
  const [branches, setBranches] = useState<Branch[]>(branchStatuses);

  useEffect(() => {
    setBranches(branchStatuses);
  }, [branchStatuses]);

  const handleDelete = async (e: React.MouseEvent, branchId: string) => {
    e.stopPropagation(); // Prevent selecting branch on delete click
    try {
      const res = await fetch("/api/branch", {
        method: "DELETE",
        body: JSON.stringify({ id: branchId }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        // Remove branch from local state
        setBranches((prev) => prev.filter((b) => b.id !== branchId));
      } else {
        toast.error(data.message || "Failed to delete branch");
      }
    } catch (error) {
      toast.error("Error deleting branch");
    }
  };

  if (branches.length === 0) {
    return (
      <div className="w-[15%] bg-gray-200 p-4 rounded-lg h-[500px] overflow-y-auto">
        <h2 className="text-[15px] font-semibold text-center text-black mb-4">
          Branches Info
        </h2>
        <p className="text-center text-gray-600">No branches found.</p>
      </div>
    );
  }

  return (
    <div className="w-[15%] bg-gray-200 p-4 rounded-lg h-[500px] overflow-y-auto">
      <h2 className="text-[15px] font-semibold text-center text-black mb-4">
        Branches Info
      </h2>
      {branches.map((branch) => (
        <div
          key={branch.id}
          onClick={() => setSelectedBranch(branch)}
          className={`cursor-pointer p-2 mb-2 rounded ${
            selectedBranch?.id === branch.id ? "bg-green-100" : "bg-white"
          } hover:bg-green-200`}
        >
          <p className="font-semibold">{branch.name}</p>
          <div className="flex flex-row gap-4">
            <p className="text-sm text-gray-600">
  Status:{" "}
  <span className={branch.status === "up" ? "text-green-600" : "text-red-600"}>
    {branch.status === "up" ? "UP" : "DOWN"}
  </span>
</p>
            <button
              onClick={(e) => handleDelete(e, branch.id)}
              className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-sm hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
