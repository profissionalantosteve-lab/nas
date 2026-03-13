import React from "react";

export default function Upload({ onFile }) {
  const onChange = (e) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  return (
    <div style={styles.box}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>1) Upload selfie</div>
      <input type="file" accept="image/*" onChange={onChange} />
      <div style={styles.hint}>
        Dica: boa luz, rosto quase de frente, orelhas visíveis ajudam.
      </div>
    </div>
  );
}

const styles = {
  box: {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 12,
    background: "#fff"
  },
  hint: { fontSize: 12, color: "#666", marginTop: 8, lineHeight: 1.3 }
};