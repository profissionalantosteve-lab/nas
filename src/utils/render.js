import { loadImageFromUrl } from "./image.js";
import { degToRad } from "./face.js";

function drawCircle(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export async function renderTryOn({ canvas, selfieImg, faceData, earring, side = "left", debug = false }) {
  const ctx = canvas.getContext("2d");

  const maxW = 900;
  const sFit = Math.min(1, maxW / selfieImg.naturalWidth);
  const w = Math.round(selfieImg.naturalWidth * sFit);
  const h = Math.round(selfieImg.naturalHeight * sFit);

  canvas.width = w;
  canvas.height = h;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(selfieImg, 0, 0, w, h);

  if (!faceData?.ok) {
    if (debug) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, w, 44);
      ctx.fillStyle = "#fff";
      ctx.font = "16px system-ui";
      ctx.fillText(faceData?.error || "No face data", 12, 28);
    }
    return;
  }

  const earringImg = await loadImageFromUrl(earring.file);

  const ax = faceData.anchor.x * w;
  const ay = faceData.anchor.y * h;

  const eyeDistPx = faceData.eyeDist * w;
  const targetSize = eyeDistPx * earring.scaleFactor;

  const baseW = earringImg.naturalWidth || 300;
  const baseH = earringImg.naturalHeight || 300;
  const s = targetSize / (baseH || 1);

  const rot =
    faceData.rollRad +
    degToRad(earring.rotOffsetDeg || 0) +
    (side === "left" ? -1 : 1) * (faceData.yaw * 0.08);

  const anchorPX = (earring.anchorX ?? 0.5) * baseW;
  const anchorPY = (earring.anchorY ?? 0.2) * baseH;

  ctx.save();
  ctx.translate(ax, ay);
  ctx.rotate(rot);
  ctx.scale(s, s);

  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;

  ctx.drawImage(earringImg, -anchorPX, -anchorPY, baseW, baseH);
  ctx.restore();

  if (debug) {
    const lm = faceData.landmarks || [];
    for (let i = 0; i < lm.length; i += 6) {
      drawCircle(ctx, lm[i].x * w, lm[i].y * h, 1.4, "rgba(0,255,255,0.55)");
    }
    drawCircle(ctx, ax, ay, 5, "rgba(255,0,0,0.85)");

    const le = faceData.debug.leftEye;
    const re = faceData.debug.rightEye;
    ctx.beginPath();
    ctx.moveTo(le.x * w, le.y * h);
    ctx.lineTo(re.x * w, re.y * h);
    ctx.strokeStyle = "rgba(255,255,0,0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export function exportCanvasToDownload(canvas, filename = "tryon.png") {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return resolve(false);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        resolve(true);
      },
      "image/png",
      1.0
    );
  });
}