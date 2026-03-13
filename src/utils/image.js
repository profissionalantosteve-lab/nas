// image utility
export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

export function loadImageFromUrl(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

export function revokeObjectUrl(url) {
  try {
    URL.revokeObjectURL(url);
  } catch {
    // ignore
  }
}