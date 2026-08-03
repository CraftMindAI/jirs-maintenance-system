/**
 * Downscales and re-encodes an image file into a base64 data URL small enough
 * to fit in a single Firestore field (1,048,487 byte limit). Progressively
 * lowers JPEG quality/dimensions until the encoded size fits under maxBytes.
 */
export async function compressImageToBase64(
  file: File,
  maxBytes: number = 900_000,
  maxDimension: number = 1600,
): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;

  let { width, height } = img;
  let dimension = maxDimension;
  let quality = 0.8;

  for (let attempt = 0; attempt < 8; attempt++) {
    const scale = Math.min(1, dimension / Math.max(width, height));
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const encoded = canvas.toDataURL("image/jpeg", quality);
    if (encoded.length <= maxBytes || (dimension <= 480 && quality <= 0.4)) {
      return encoded;
    }

    // Alternate between lowering quality and shrinking dimensions.
    if (quality > 0.4) {
      quality -= 0.15;
    } else {
      dimension = Math.round(dimension * 0.75);
    }
  }

  return canvas.toDataURL("image/jpeg", 0.4);
}
