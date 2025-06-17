export async function askGeminiWeather(question) {
  const res = await fetch("/api/gemini/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) {
    throw new Error("Failed to get response from Gemini");
  }
  const data = await res.json();
  return data.text || "Sorry, I couldn't find an answer.";
}