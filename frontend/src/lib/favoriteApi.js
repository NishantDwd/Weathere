const API_URL = import.meta.env.VITE_API_URL;

export async function fetchFavorites(token) {
  const res = await fetch(`${API_URL}/favorites/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch favorites");
  }
  const data = await res.json();
  return data.favorites.map(f => f.city);
}

export async function removeFavorite(city, token) {
  const res = await fetch(`${API_URL}/favorites/remove`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ city }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to remove favorite");
  }
  return true;
}