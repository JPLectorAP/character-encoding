export function toUTF8Bytes(str: string): number[] {
  return Array.from(new TextEncoder().encode(str))
}

export function toBinary(n: number, pad = 8): string {
  return n.toString(2).padStart(pad, '0')
}
