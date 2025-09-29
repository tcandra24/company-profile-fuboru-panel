export function ucwords(str: string): string {
  return String(str)
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
}
