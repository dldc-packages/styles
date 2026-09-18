const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

export function randomShortId(length: number = 6): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}
