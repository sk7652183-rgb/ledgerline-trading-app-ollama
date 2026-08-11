const BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchAssets() {
  const res = await fetch(`${BASE}/api/assets`);

  if (!res.ok) {
    throw new Error("Failed to load assets");
  }

  return res.json();
}

export async function fetchHistory(sessionId) {
  const res = await fetch(`${BASE}/api/chat/${sessionId}`);

  if (!res.ok) {
    throw new Error("Failed to load chat history");
  }

  return res.json();
}

export async function sendMessage(sessionId, message) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      message,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    throw new Error(
      err.error || "Failed to send message"
    );
  }

  return res.json();
}

export function getSessionId() {
  let id = localStorage.getItem("ledgerline_session");

  if (!id) {
    id =
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}`;

    localStorage.setItem("ledgerline_session", id);
  }

  return id;
}
