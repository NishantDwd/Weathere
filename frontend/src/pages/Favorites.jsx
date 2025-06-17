import { useFavorites } from "@/components/FavoritesContext";
import { Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleCityClick = (city) => {
    navigate("/", { state: { city } });
  };

  const handleDelete = async (city) => {
    try {
      await removeFavorite(city);
      toast.success("Removed from favorites!");
    } catch (err) {
      toast.error(err.message || "Failed to remove favorite!");
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="text-2xl font-bold text-center mt-10 text-zinc-500">
        <Star className="inline w-8 h-8 text-yellow-400 mr-2" />
        No favorites yet!
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      {favorites.map((fav, idx) => (
        <div
          key={fav.name + idx}
          className="flex items-center justify-between bg-white/70 dark:bg-zinc-900/70 rounded-xl shadow p-4 border border-yellow-100 dark:border-yellow-900 hover:shadow-lg transition"
        >
          <div className="flex items-center gap-4">
            <Star className="w-6 h-6 text-yellow-400" />
            <div>
              <div
                className="text-lg font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer hover:underline hover:text-indigo-600 dark:hover:text-indigo-300 transition"
                onClick={() => handleCityClick(fav.name)}
                title="View details"
                tabIndex={0}
                role="button"
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") handleCityClick(fav.name);
                }}
              >
                {fav.name}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-300 capitalize">{fav.weather?.[0]?.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-1">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-300">{fav.main?.temp}{fav.tempUnit}</span>
              <span className="text-xs text-zinc-600 dark:text-zinc-300">Feels like: {fav.main?.feels_like}{fav.tempUnit}</span>
            </div>
            <button
              className="ml-4 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition"
              onClick={() => handleDelete(fav.name)}
              aria-label="Remove from favorites"
              type="button"
            >
              <X className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}