/**
 * Compresses and resizes an image in the browser using HTML5 Canvas.
 * Converts heavy raw photos (3MB - 10MB) into lightweight WebP/JPEG (40KB - 90KB)
 * for instant loading on web and mobile.
 */
export async function compressImageClient(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.85
): Promise<{ file: File; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ file, dataUrl: e.target?.result as string });
          return;
        }

        // Draw image resized
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        const format = canvas.toDataURL("image/webp").startsWith("data:image/webp")
          ? "image/webp"
          : "image/jpeg";
        const extension = format === "image/webp" ? "webp" : "jpg";

        const dataUrl = canvas.toDataURL(format, quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const cleanFileName = file.name.replace(/\.[^/.]+$/, "") + `.${extension}`;
              const compressedFile = new File([blob], cleanFileName, { type: format });
              resolve({ file: compressedFile, dataUrl });
            } else {
              resolve({ file, dataUrl });
            }
          },
          format,
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
