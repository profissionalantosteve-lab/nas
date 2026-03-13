import React, { useMemo, useState } from "react";

import Upload from "./components/Upload.jsx";
import EarringGallery from "./components/EarringGallery.jsx";
import PreviewCanvas from "./components/PreviewCanvas.jsx";
import DebugOverlay from "./components/DebugOverlay.jsx";

import earringsData from "./data/earrings.json";
import { exportCanvasToDownload } from "./utils/render.js";

export default function App() {
  const [file, setFile] = useState(null);
  const [selectedId, setSelectedId] = useState(earringsData[0]?.id || null);
  const [debug, setDebug] = useState(false);
  const [side, setSide] = useState("left");
  const [canvasRef, setCanvasRef] = useState(null);
  const [lastFaceOk, setLastFaceOk] = useState(false);

  const selected = useMemo(
    () => earringsData.find((e) => e.id === selectedId) || null,
    [selectedId]
  );

  async function onDownload() {
    if (!canvasRef) return;
    await exportCanvasToDownload(canvasRef, "earring-tryon.png");
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>Earring Try-On MVP</div>
        <div style={{ fontSize: 12, color: "#666" }}>
          Upload → Choose → Generate → Download
        </div>
      </header>

      <div style={styles.layout}>
        <div style={styles.left}>
          <Upload onFile={setFile} />

          <div style={{ height: 12 }} />

          <EarringGallery
            earrings={earringsData}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <div style={{ height: 12 }} />

          <DebugOverlay
            debug={debug}
            setDebug={setDebug}
            side={side}
            setSide={setSide}
          />

          <div style={{ height: 12 }} />

          <button
            onClick={onDownload}
            disabled={!canvasRef || !lastFaceOk}
            style={{
              ...styles.download,
              opacity: canvasRef && lastFaceOk ? 1 : 0.5
            }}
          >
            4) Download
          </button>

          <div style={styles.footerNote}>
            Dica: foto com boa luz, rosto quase de frente. Se ficar torto, troca o
            lado (Left/Right).
          </div>
        </div>

        <div style={styles.right}>
          <PreviewCanvas
            file={file}
            earring={selected}
            side={side}
            debug={debug}
            onCanvasReady={(c, fd) => {
              setCanvasRef(c);
              setLastFaceOk(!!fd?.ok);
            }}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f6f6f6", padding: 16 },
  header: {
    maxWidth: 1100,
    margin: "0 auto 12px auto",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid #ddd",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12
  },
  layout: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: 12
  },
  left: { display: "flex", flexDirection: "column" },
  right: {},
  download: {
    border: "1px solid #0b5",
    borderRadius: 12,
    padding: "10px 12px",
    background: "#0b5",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700
  },
  footerNote: { marginTop: 10, fontSize: 12, color: "#666", lineHeight: 1.35 }
};
