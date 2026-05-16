// ============================================
// AMAL ABAYA — Client-side image compression
// ============================================
// Converts a File (from <input type="file">) into a compressed
// base64 data URL that fits inside a Firestore document.
//
// Firestore document limit: 1 MB total. Base64 adds ~33% overhead,
// so we target a max base64 string size of ~700 KB, which means
// a raw JPEG of about 525 KB. We achieve that by resizing the
// longest edge and re-encoding as JPEG at progressively lower
// quality until we fit.
// ============================================

/**
 * Compress an image File into a base64 data URL.
 *
 * @param {File} file        - the image file
 * @param {object} opts
 *   @param {number} opts.maxDim     - max width or height (default 1400)
 *   @param {number} opts.maxBytes   - max final data-URL length (default 700_000)
 *   @param {number} opts.startQuality - starting JPEG quality 0..1 (default 0.85)
 * @returns {Promise<string>} compressed JPEG as `data:image/jpeg;base64,…`
 */
async function compressImage(file, opts = {}) {
  const maxDim       = opts.maxDim       || 1400;
  const maxBytes     = opts.maxBytes     || 700_000;
  const startQuality = opts.startQuality || 0.85;
  const minQuality   = 0.4;

  // 1. Load file into an Image element
  const dataURL = await fileToDataURL(file);
  const img = await loadImage(dataURL);

  // 2. Compute target dimensions
  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    if (width >= height) {
      height = Math.round(height * (maxDim / width));
      width = maxDim;
    } else {
      width = Math.round(width * (maxDim / height));
      height = maxDim;
    }
  }

  // 3. Draw to canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  // White background so transparent PNGs don't show as black in JPEG
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  // 4. Encode at progressively lower quality until we fit
  let q = startQuality;
  let out = canvas.toDataURL("image/jpeg", q);
  while (out.length > maxBytes && q > minQuality) {
    q -= 0.1;
    out = canvas.toDataURL("image/jpeg", q);
  }

  // 5. If still too big, try shrinking dimensions once more
  if (out.length > maxBytes) {
    const c2 = document.createElement("canvas");
    c2.width  = Math.round(width  * 0.7);
    c2.height = Math.round(height * 0.7);
    const ctx2 = c2.getContext("2d");
    ctx2.fillStyle = "#ffffff";
    ctx2.fillRect(0, 0, c2.width, c2.height);
    ctx2.drawImage(canvas, 0, 0, c2.width, c2.height);
    out = c2.toDataURL("image/jpeg", 0.7);
  }

  return out;
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = src;
  });
}

// Friendly KB / MB label
function bytesLabel(n) {
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / 1024 / 1024).toFixed(2) + " MB";
}

window.compressImage = compressImage;
window.bytesLabel = bytesLabel;
