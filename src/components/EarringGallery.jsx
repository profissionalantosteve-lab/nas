import React from "react";

export default function EarringGallery({ earrings, selectedId, onSelect }) {
  return (
    <div style={styles.box}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>2) Choose earring</div>
      <div style={styles.grid}>
        {earrings.map((e) => (
          <button
            key={e.id}
            onClick={() => onSelect(e.id)}
            style={{
              ...styles.card,
              borderColor: e.id === selectedId ? "#111" : "#ddd"
            }}
            title={e.name}
          >
            <img src={e.file} alt={e.name} style={styles.thumb} />
            <div style={styles.name}>{e.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  box: { border: "1px solid #ddd", borderRadius: 12, padding: 12, background: "#fff" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  card: {
    appearance: "none",
    border: "2px solid #ddd",
    borderRadius: 12,
    padding: 10,
    background: "#fafafa",
    cursor: "pointer",
    textAlign: "left"
  },
  thumb: { width: "100%", height: 80, objectFit: "contain", display: "block" },
  name: { marginTop: 6, fontSize: 12, color: "#222" }
};