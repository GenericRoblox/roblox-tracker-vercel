import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function fetchGame() {
    setError("");
    setResult(null);

    const res = await fetch(`/api/latest-activity?username=${username}`);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Unknown error");
      return;
    }
    const data = await res.json();
    setResult(data);
  }

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>RBX Activity Tracker</h1>
      <input
        type="text"
        placeholder="Enter Roblox username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "8px", fontSize: "16px", width: "300px" }}
      />
      <button onClick={fetchGame} style={{ padding: "8px 16px", marginLeft: 8 }}>
        Check Game
      </button>

      {error && <p style={{ color: "red", marginTop: 20 }}>❌ {error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Latest Game Info</h2>
          <p><strong>Game Name:</strong> {result.gameName}</p>
          <p><strong>Description:</strong> {result.gameDescription}</p>
          <p><strong>Latest Badge:</strong> {result.latestBadge}</p>
          <p><strong>Badge Awarded At:</strong> {new Date(result.badgeAwardedAt).toLocaleString()}</p>
          <a
            href={result.gameLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 10,
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: 4
            }}
          >
            🔗 Open This Place
          </a>
        </div>
      )}
    </main>
  );
}
