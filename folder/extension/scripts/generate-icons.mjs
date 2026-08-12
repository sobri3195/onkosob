import { mkdir, writeFile } from 'node:fs/promises'
import { deflateSync } from 'node:zlib'

const sizes = [16, 32, 48, 128]
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

function chunk(type, data) {
  const name = Buffer.from(type)
  const payload = Buffer.concat([name, data])
  let crc = 0xffffffff
  for (const byte of payload) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
    }
  }
  const length = Buffer.alloc(4)
  const checksum = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  checksum.writeUInt32BE((crc ^ 0xffffffff) >>> 0)
  return Buffer.concat([length, payload, checksum])
}

function createIcon(size) {
  const border = Math.max(1, Math.floor(size / 16))
  const flameWidth = Math.max(1, Math.floor(size / 9))
  const rows = []

  for (let y = 0; y < size; y += 1) {
    const row = [0]
    for (let x = 0; x < size; x += 1) {
      const isBorder = x < border || y < border || x >= size - border || y >= size - border
      const isFlame = Math.abs(x - size / 2) < flameWidth && y > size / 5 && y < (size * 4) / 5
      row.push(...(isBorder || isFlame ? [212, 169, 77, 255] : [7, 20, 38, 255]))
    }
    rows.push(Buffer.from(row))
  }

  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header.set([8, 6, 0, 0, 0], 8)
  return Buffer.concat([
    signature,
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

await mkdir(new URL('../public/icons/', import.meta.url), { recursive: true })
await Promise.all(sizes.map((size) => writeFile(
  new URL(`../public/icons/icon${size}.png`, import.meta.url),
  createIcon(size),
)))
console.log(`Generated Lentera extension icons: ${sizes.join(', ')}px`)
