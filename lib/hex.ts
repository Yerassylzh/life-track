export function hexToRgba(hex: string, alpha: number = 1): string {
  // Remove leading #
  hex = hex.replace(/^#/, "");

  // Expand shorthand (e.g. #abc → #aabbcc)
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${alpha})`;
}
