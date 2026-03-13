import React from "react";

export default function DebugOverlay({ debug, setDebug, side, setSide }) {
  return (
    <div style={styles.box}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Options</div>

      <label style={styles.row}>
        <input
          type="checkbox"
          checked={debug}
          onChange={(e) => setDebug(e.target.checked)}
        />
        <span>Debug landmarks</span>
      </label>

      <div style={{ marginTop: 10, fontSize: 12, color: "#555" }}>Earring side</div>
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button
          onClick={() => setSide("left")}
          style={{
            ...styles.pill,
            background: side === "left" ? "#111" : "#eee",
            color: side === "left" ? "#fff" : "#111"
          }}
        >
          Left
        </button>
        <button
          onClick={() => setSide("right")}
          style={{
            ...styles.pill,
            background: side === "right" ? "#111" : "#eee",
            color: side === "right" ? "#fff" : "#111"
          }}
        >
          Right
        </button>
      </div>
    </div>
  );
}

const styles = {
  box: { border: "1px solid #ddd", borderRadius: 12, padding: 12, background: "#fff" },
  row: { display: "flex", gap: 8, alignItems: "center", fontSize: 13 },
  pill: { border: "1px solid #ddd", borderRadius: 999, padding: "6px 10px", cursor: "pointer" }
};