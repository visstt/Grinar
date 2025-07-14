import React, { useState } from "react";

const DEV_PASSWORD = "bentydev2025";

export default function DevPasswordGate({ children }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState(() => {
    return localStorage.getItem("dev_auth") === DEV_PASSWORD;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === DEV_PASSWORD) {
      localStorage.setItem("dev_auth", DEV_PASSWORD);
      setAuthorized(true);
      setError("");
    } else {
      setError("Неверный пароль");
    }
  };

  if (!authorized) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <h2>Доступ к сайту только для разработчиков</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите пароль"
            style={{ padding: 8, fontSize: 18 }}
          />
          <button type="submit" style={{ padding: 8, fontSize: 18 }}>
            Войти
          </button>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </form>
      </div>
    );
  }

  return children;
}
