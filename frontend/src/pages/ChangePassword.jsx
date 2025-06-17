import { useState } from "react";
import { User, Pencil, KeyRound, CloudSun } from "lucide-react";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [newUsername, setNewUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);

  // Password dialog state
  const [showPwDialog, setShowPwDialog] = useState(false);
  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwLoading, setPwLoading] = useState(false);

  // Change username handler
  const handleChangeUsername = async (e) => {
  e.preventDefault();
  if (!newUsername.trim()) {
    toast.error("Enter a new username");
    return;
  }
  setUsernameLoading(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/auth/change-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newUsername }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Username changed!");
      // Update token and user in localStorage
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      window.location.reload();
    } else {
      toast.error(data.error || (data.errors && data.errors[0]?.msg) || "Failed to change username");
    }
  } catch {
    toast.error("Failed to change username");
  }
  setUsernameLoading(false);
};

  // Change password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setPwLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pwForm),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully!");
        setShowPwDialog(false);
        setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.error || (data.errors && data.errors[0]?.msg) || "Failed to change password");
      }
    } catch {
      toast.error("Failed to change password");
    }
    setPwLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-fuchsia-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-indigo-900">
      <div className="w-full max-w-md mx-auto bg-white/90 dark:bg-zinc-900/90 rounded-3xl shadow-2xl p-10 border border-indigo-100 dark:border-indigo-800 backdrop-blur-lg">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <CloudSun className="w-8 h-8 text-yellow-400 drop-shadow" />
          <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            Hi, {user?.username || "User"}!
          </span>
        </div>
        {/* Change Username */}
        <form className="flex items-center gap-2 mb-8" onSubmit={handleChangeUsername}>
          <Pencil className="w-5 h-5 text-fuchsia-500" />
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="New username"
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
            maxLength={30}
          />
          <button
            type="submit"
            className="px-3 py-2 rounded bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition"
            disabled={usernameLoading}
          >
            {usernameLoading ? "Changing..." : "Change"}
          </button>
        </form>
        {/* Change Password */}
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-100">Change Password</span>
        </div>
        <button
          className="w-full mb-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-blue-500 text-white font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none"
          onClick={() => setShowPwDialog(true)}
        >
          Change Password
        </button>
        {/* Password Dialog */}
        {showPwDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-indigo-200 dark:border-indigo-800">
              <form className="space-y-3" onSubmit={handleChangePassword}>
                <div className="flex items-center gap-2 mb-1">
                  <KeyRound className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-zinc-800 dark:text-zinc-100">Change Password</span>
                </div>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  placeholder="Old password"
                  value={pwForm.oldPassword}
                  onChange={e => setPwForm(f => ({ ...f, oldPassword: e.target.value }))}
                  required
                />
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  placeholder="New password"
                  value={pwForm.newPassword}
                  onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                  required
                  minLength={6}
                />
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  placeholder="Confirm new password"
                  value={pwForm.confirmPassword}
                  onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  required
                  minLength={6}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 font-bold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
                    onClick={() => setShowPwDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition"
                    disabled={pwLoading}
                  >
                    {pwLoading ? "Changing..." : "Change"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}