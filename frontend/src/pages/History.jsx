import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, History as HistoryIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchHistory,
  deleteHistory,
  clearHistory,
} from "@/lib/historyApi";

export default function History() {
  const [history, setHistory] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch history from backend on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchHistory(token)
      .then((data) => setHistory(data))
      .catch(() => toast.error("Failed to fetch history"))
      .finally(() => setLoading(false));
  }, []);

  // Click city to go to Home with that city
  const handleCityClick = (city) => {
    navigate("/", { state: { city } });
  };

  // Delete a single city from history
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await deleteHistory(id, token);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("Removed from history!");
    } catch {
      toast.error("Failed to remove from history!");
    }
  };

  // Clear all history with confirmation
  const handleClearHistory = () => setConfirmClear(true);

  const confirmClearHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      await clearHistory(token);
      setHistory([]);
      toast.success("History cleared!");
    } catch {
      toast.error("Failed to clear history!");
    }
    setConfirmClear(false);
  };

  const cancelClearHistory = () => setConfirmClear(false);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <HistoryIcon className="w-7 h-7 text-indigo-400" />
          Search History
        </div>
        {history.length > 0 && (
          <button
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-200 font-semibold transition"
            onClick={handleClearHistory}
          >
            <Trash2 className="w-5 h-5" />
            Clear History
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmClear && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 flex flex-col items-center gap-4 border border-zinc-200 dark:border-zinc-700">
            <div className="text-lg font-semibold text-red-600 dark:text-red-300">
              Are you sure you want to clear all history?
            </div>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition"
                onClick={confirmClearHistory}
              >
                Yes, Clear All
              </button>
              <button
                className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 font-bold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
                onClick={cancelClearHistory}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center text-zinc-500 text-lg mt-12">Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-center text-zinc-500 text-lg mt-12">No search history yet.</div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 rounded-lg shadow p-4 border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition"
            >
              <div
                className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 cursor-pointer hover:underline"
                onClick={() => handleCityClick(item.city)}
                tabIndex={0}
                role="button"
                title="View details"
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") handleCityClick(item.city);
                }}
              >
                {item.city}
                <span className="block text-xs text-zinc-400 mt-1">
                  {item.searched_at && new Date(item.searched_at).toLocaleString()}
                </span>
              </div>
              <button
                className="ml-4 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition"
                onClick={() => handleDelete(item.id)}
                aria-label="Remove from history"
                type="button"
              >
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}