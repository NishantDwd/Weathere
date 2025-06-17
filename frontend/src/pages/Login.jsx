import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CloudSun } from "lucide-react";

export default function Login({ onUserUpdate }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Both fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (onUserUpdate) onUserUpdate(data.user);
        toast.success("Login successful! Welcome back.");
        navigate("/");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch {
      toast.error("Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-fuchsia-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-indigo-900">
      <div className="w-full max-w-md mx-auto bg-white/90 dark:bg-zinc-900/90 rounded-3xl shadow-2xl p-10 border border-indigo-100 dark:border-indigo-800 backdrop-blur-lg">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 dark:text-indigo-300 tracking-tight drop-shadow flex items-center justify-center gap-2">
          <CloudSun className="w-8 h-8 text-yellow-400 drop-shadow" />
          Login to Weathere
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block mb-1 font-semibold text-zinc-700 dark:text-zinc-200">Email</label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="bg-white/80 dark:bg-zinc-800/80"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-zinc-700 dark:text-zinc-200">Password</label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              minLength={6}
              className="bg-white/80 dark:bg-zinc-800/80"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-blue-500 text-white font-bold text-lg shadow-lg transition-all duration-300 relative overflow-hidden group hover:shadow-2xl hover:scale-105 focus:outline-none
              before:absolute before:inset-0 before:bg-indigo-700/20 before:rounded-xl before:transition-transform before:duration-300 before:origin-bottom-right before:scale-x-0 group-hover:before:scale-x-100
              cursor-pointer"
            disabled={loading}
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            <span className="relative z-10 group-hover:animate-pulse">
              {loading ? "Logging in..." : "Login"}
            </span>
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-2 text-center text-sm text-zinc-600 dark:text-zinc-300">
          <span>
            Don't have an account?{" "}
            <span
              className="text-indigo-600 hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Create an account
            </span>
          </span>
          <span>
            <span
              className="text-indigo-600 hover:underline cursor-pointer"
              onClick={() => navigate("/reset-password")}
            >
              Forgot password?
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}