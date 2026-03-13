import React, { useEffect, useMemo, useRef, useState } from "react";
import { loadImageFromFile, revokeObjectUrl } from "../utils/image.js";
import { detectFaceData } from "../utils/face.js";
import { renderTryOn } from "../utils/render.js";

export default function PreviewCanvas({ file, earring, side, debug, onCanvasReady }) {
  const canvasRef = useRef(null);
  const [selfieImg, setSelfieImg] = useState(null);
  const [faceData, setFaceData] = useState(null);
  const [status, setStatus] = useState("Upload a selfie to start.");

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;

    async function run() {
      if (!file) {
        setSelfieImg(null);
        setFaceData(null);
        setStatus("Upload a selfie to start.");
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          canvasRef.current.width = 900;
          canvasRef.current.height = 600;
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        return;
      }

      setStatus("Loading image...");
      try {
        const { img, url } = await loadImageFromFile(file);
        objectUrl = url;
        if (cancelled) return;
        setSelfieImg(img);
        setStatus("Ready. Click Generate.");
      } catch {
        setStatus("Failed to load image.");
      }
    }

    run();
    return () => {
      cancelled = true;
      if (objectUrl) revokeObjectUrl(objectUrl);
    };
  }, [file]);

  const canGenerate = useMemo(() => !!selfieImg && !!earring, [selfieImg, earring]);

  async function generate() {
    if (!canvasRef.current || !selfieImg || !earring) return;

    setStatus("Detecting face...");
    const fd = await detectFaceData(selfieImg, side);
    setFaceData(fd);

    setStatus(fd.ok ? "Rendering..." : fd.error || "Face not detected.");
    await renderTryOn({
      canvas: canvasRef.current,
      selfieImg,
      faceData: fd,
      earring,
      side,
      debug
    });

    setStatus(fd.ok ? "Done. You can download." : (fd.error || "Failed."));
    onCanvasReady?.(canvasRef.current, fd);
  }

  useEffect(() => {
    if (!canvasRef.current || !selfieImg || !earring || !faceData?.ok) return;
    renderTryOn({ canvas: canvasRef.current, selfieImg, faceData, earring, side, debug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debug, side]);

  return (
    <div style={styles.box}>
      <div style={styles.topRow}>
        <div style={{ fontWeight: 600 }}>3) Preview</div>
        <button
          onClick={generate}
          disabled={!canGenerate}
          style={{ ...styles.btn, opacity: canGenerate ? 1 : 0.5 }}
        >
          Generate
        </button>
      </div>

      <div style={styles.status}>{status}</div>

      <div style={styles.canvasWrap}>
        <canvas ref={canvasRef} style={styles.canvas} />
      </div>
    </div>
  );
}

const styles = {
  box: { border: "1px solid #ddd", borderRadius: 12, padding: 12, background: "#fff" },
  topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  btn: {
    border: "1px solid #111",
    borderRadius: 10,
    padding: "8px 12px",
    background: "#111",
    color: "#fff",
    cursor: "pointer"
  },
  status: { marginTop: 8, fontSize: 12, color: "#555" },
  canvasWrap: {
    marginTop: 10,
    width: "100%",
    background: "#f4f4f4",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #eee"
  },
  canvas: { display: "block", width: "100%", height: "auto" }
};