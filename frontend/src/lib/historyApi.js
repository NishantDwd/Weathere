export async function fetchHistory(token) {
  const res = await fetch("/api/history/list", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch history");
  const data = await res.json();
  return data.history;
}

export async function addHistory(city, token) {
  await fetch("/api/history/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ city }),
  });
}

export async function deleteHistory(id, token) {
  const res = await fetch("/api/history/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete history entry");
}

export async function clearHistory(token) {
  const res = await fetch("/api/history/clear", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to clear history");
}