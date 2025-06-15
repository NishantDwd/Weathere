import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CloudSun } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // Signup request
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Immediately log in after signup
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
          localStorage.setItem("token", loginData.token);
          // Store user info for later use
          localStorage.setItem("user", JSON.stringify(loginData.user));
          toast.success("Signup successful! Welcome.");
          navigate("/");
        } else {
          toast.error(loginData.error || "Signup succeeded, but login failed.");
        }
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch {
      toast.error("Signup failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-fuchsia-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-indigo-900">
      <div className="w-full max-w-md mx-auto bg-white/90 dark:bg-zinc-900/90 rounded-3xl shadow-2xl p-10 border border-indigo-100 dark:border-indigo-800 backdrop-blur-lg">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 dark:text-indigo-300 tracking-tight drop-shadow flex items-center justify-center gap-2">
          <CloudSun className="w-8 h-8 text-yellow-400 drop-shadow" />
          Sign Up for Weathere
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block mb-1 font-semibold text-zinc-700 dark:text-zinc-200">Username</label>
            <Input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoFocus
              required
              className="bg-white/80 dark:bg-zinc-800/80"
            />
          </div>
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
          <div>
            <label className="block mb-1 font-semibold text-zinc-700 dark:text-zinc-200">Confirm Password</label>
            <Input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
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
              {loading ? "Signing up..." : "Sign Up"}
            </span>
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-300">
          Already have an account?{" "}
          <span
            className="text-indigo-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}