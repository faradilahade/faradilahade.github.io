/**
 * One-off generator for public/og.png (1200x630) and public/apple-touch-icon.png (180x180).
 * Pure Node (zlib) — no image libraries. Draws the same "data bands" motif as the site banner.
 *   node scripts/make-images.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import zlib from 'node:zlib'

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c
})
const crc32 = (buf) => {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}
function png(w, h, rgb) {
  const raw = Buffer.alloc((w * 3 + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0
    rgb.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const NIGHT = [7, 13, 24], OCEAN = [92, 157, 201], TIDE = [143, 195, 227], BRASS = [176, 141, 74], SAND = [216, 203, 174]
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)))

function render(w, h, bands, dots) {
  const out = Buffer.alloc(w * h * 3)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w, v = y / h
      // base: night with a cool glow top-right and warm glow bottom-left
      let c = [...NIGHT]
      const g1 = Math.exp(-(((u - 0.85) ** 2) / 0.12 + ((v - 0.1) ** 2) / 0.25))
      const g2 = Math.exp(-(((u - 0.1) ** 2) / 0.1 + ((v - 0.95) ** 2) / 0.2))
      c = mix(c, OCEAN, g1 * 0.28)
      c = mix(c, BRASS, g2 * 0.18)
      for (const b of bands) {
        const cy = h * (b.y + b.a * Math.sin(u * b.f * Math.PI * 2 + b.p) + b.a2 * Math.sin(u * b.f2 * Math.PI * 2 + b.p2))
        const d = y - cy
        const fade = Math.sin(Math.PI * Math.min(1, Math.max(0, (u - b.x0) / (b.x1 - b.x0)))) // fades at both ends
        if (fade <= 0) continue
        const halo = Math.exp(-(d * d) / (2 * (b.halo ** 2))) * 0.35 * fade
        const core = Math.exp(-(d * d) / (2 * (b.core ** 2))) * 0.95 * fade
        c = mix(c, b.col, Math.min(1, halo))
        c = mix(c, b.hi, Math.min(1, core))
      }
      for (const d of dots) {
        const dx = x - d.x * w, dy = y - d.y * h
        const r2 = dx * dx + dy * dy
        if (r2 < d.r * d.r * 36) {
          const k = Math.exp(-r2 / (2 * d.r * d.r))
          c = mix(c, TIDE, k * 0.9)
        }
      }
      // vignette
      const vig = 1 - 0.25 * Math.pow(Math.hypot(u - 0.5, v - 0.5) / 0.75, 2)
      c = c.map(ch => ch * vig)
      const i = (y * w + x) * 3
      out[i] = clamp(c[0]); out[i + 1] = clamp(c[1]); out[i + 2] = clamp(c[2])
    }
  }
  return out
}

mkdirSync('public', { recursive: true })

// --- OG image ------------------------------------------------------
const W = 1200, H = 630
const bands = [
  { y: 0.58, a: 0.09, f: 0.9, p: 0.2, a2: 0.03, f2: 2.3, p2: 1.1, x0: -0.05, x1: 1.05, core: 1.6, halo: 22, col: OCEAN, hi: TIDE },
  { y: 0.64, a: 0.07, f: 1.1, p: 1.4, a2: 0.02, f2: 3.1, p2: 0.3, x0: 0.05, x1: 1.0, core: 1.0, halo: 14, col: OCEAN, hi: TIDE },
  { y: 0.72, a: 0.08, f: 0.8, p: 2.6, a2: 0.02, f2: 2.0, p2: 2.0, x0: -0.05, x1: 1.05, core: 1.2, halo: 18, col: BRASS, hi: SAND },
  { y: 0.30, a: 0.05, f: 1.2, p: 0.9, a2: 0.015, f2: 2.7, p2: 0.5, x0: 0.1, x1: 1.05, core: 0.8, halo: 10, col: OCEAN, hi: TIDE },
]
const dots = [
  [0.12, 0.6, 2.2], [0.27, 0.66, 1.6], [0.41, 0.56, 2.6], [0.55, 0.5, 1.8], [0.68, 0.45, 3.0], [0.8, 0.5, 2.0],
  [0.9, 0.42, 1.6], [0.2, 0.3, 1.4], [0.5, 0.28, 1.8], [0.75, 0.22, 1.5], [0.33, 0.78, 1.5], [0.62, 0.72, 1.7],
].map(([x, y, r]) => ({ x, y, r }))
writeFileSync('public/og.png', png(W, H, render(W, H, bands, dots)))

// --- Apple touch icon ---------------------------------------------
const S = 180
const iconBands = [
  { y: 0.55, a: 0.12, f: 1.0, p: 0.4, a2: 0.03, f2: 2.5, p2: 0.8, x0: -0.05, x1: 1.05, core: 1.4, halo: 12, col: OCEAN, hi: TIDE },
  { y: 0.68, a: 0.10, f: 0.9, p: 2.2, a2: 0.02, f2: 2.1, p2: 1.5, x0: -0.05, x1: 1.05, core: 1.2, halo: 10, col: BRASS, hi: SAND },
]
const iconDots = [[0.3, 0.5, 2], [0.62, 0.42, 2.6], [0.82, 0.55, 1.8]].map(([x, y, r]) => ({ x, y, r }))
writeFileSync('public/apple-touch-icon.png', png(S, S, render(S, S, iconBands, iconDots)))

console.log('wrote public/og.png and public/apple-touch-icon.png')
