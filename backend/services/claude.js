const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL || "llama3.1";

// Ollama's /api/chat endpoint takes a plain messages array (role/content)
// and a separate system message tacked on as its own role:"system" entry.
export async function askClaude({ system, messages }) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      messages: [{ role: "system", content: system }, ...messages],
      options: { num_predict: 500 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Ollama API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return (data.message?.content || "").trim();
}
