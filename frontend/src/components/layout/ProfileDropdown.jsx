import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-blue-100 dark:hover:bg-zinc-800 transition"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
      >
        <img
          src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.username || "User"}`}
          alt="Profile"
          className="w-8 h-8 rounded-full border border-blue-300 shadow-sm"
        />
        <span className="font-medium text-zinc-800 dark:text-zinc-100">{user?.username || "User"}</span>
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-3 flex items-center gap-3 border-b border-border">
            <User className="w-6 h-6 text-blue-400" />
            <div>
              <div className="font-semibold">{user?.username || "User"}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 break-all max-w-[160px]">{user?.email || ""}</div>
            </div>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-blue-50 dark:hover:bg-zinc-800 transition rounded-t-xl"
            onClick={() => {
              setOpen(false);
              navigate("/change-password");
            }}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-blue-50 dark:hover:bg-zinc-800 transition rounded-b-xl text-red-500"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}