// face detection utility
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

let landmarkerPromise = null;

async function getLandmarker() {
  if (landmarkerPromise) return landmarkerPromise;

  landmarkerPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.20/wasm"
    );

    const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
      },
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
      runningMode: "IMAGE",
      numFaces: 1
    });

    return faceLandmarker;
  })();

  return landmarkerPromise;
}

function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function degToRad(d) {
  return (d * Math.PI) / 180;
}

export async function detectFaceData(img, side = "left") {
  const landmarker = await getLandmarker();

  const res = landmarker.detect(img);
  const faces = res?.faceLandmarks;
  if (!faces || faces.length === 0) {
    return { ok: false, error: "Face not detected. Try a clearer selfie with good lighting." };
  }

  const lm = faces[0];

  // indices pragmáticos para MVP
  const leftEye = lm[33];
  const rightEye = lm[263];
  const nose = lm[1];
  const chin = lm[152];
  const leftCheek = lm[234];
  const rightCheek = lm[454];

  const eyeDist = dist(leftEye, rightEye);

  // roll: inclinação pela linha dos olhos
  const rollRad = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

  // yaw heuristic: nariz deslocado do meio dos olhos
  const midEyeX = (leftEye.x + rightEye.x) / 2;
  const yawRaw = (nose.x - midEyeX) / (eyeDist + 1e-6);
  const yaw = clamp(yawRaw, -0.6, 0.6);

  // âncora lateral
  const cheek = side === "left" ? leftCheek : rightCheek;
  const faceH = Math.abs(chin.y - ((leftEye.y + rightEye.y) / 2));
  const down = 0.10 * faceH;

  const anchor = { x: cheek.x, y: cheek.y + down };

  // nudge por yaw (bem leve)
  const yawNudge = 0.06 * eyeDist * (side === "left" ? -yaw : yaw);
  anchor.x = clamp(anchor.x + yawNudge, 0.02, 0.98);

  return {
    ok: true,
    landmarks: lm,
    rollRad,
    yaw,
    eyeDist,
    anchor,
    debug: { leftEye, rightEye, nose, chin, leftCheek, rightCheek }
  };
}