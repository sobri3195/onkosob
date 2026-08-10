/** Generate required raster/ICO brand deliverables without checking binaries into Git. */
import { deflateSync } from 'node:zlib'
import { readFileSync, writeFileSync } from 'node:fs'

const palette = { navy: [7, 20, 38, 255], surface: [12, 27, 48, 255], gold: [212, 169, 77, 255], ivory: [247, 242, 232, 255] }
const crcTable = Array.from({ length: 256 }, (_, value) => { let crc = value; for (let bit = 0; bit < 8; bit++) crc = (crc & 1) ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1; return crc >>> 0 })
const crc32 = data => { let crc = 0xffffffff; for (const byte of data) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8); return (crc ^ 0xffffffff) >>> 0 }
const chunk = (type, data) => { const output = Buffer.alloc(data.length + 12); output.writeUInt32BE(data.length); output.write(type, 4); data.copy(output, 8); output.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type), data])), data.length + 8); return output }
const encodePng = image => {
  const raw = Buffer.alloc((image.width * 4 + 1) * image.height)
  for (let y = 0; y < image.height; y++) image.data.copy(raw, y * (image.width * 4 + 1) + 1, y * image.width * 4, (y + 1) * image.width * 4)
  const header = Buffer.alloc(13); header.writeUInt32BE(image.width); header.writeUInt32BE(image.height, 4); header[8] = 8; header[9] = 6
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))])
}
const image = (width, height, color) => { const data = Buffer.alloc(width * height * 4); for (let i = 0; i < width * height; i++) color.forEach((value, channel) => { data[i * 4 + channel] = value }); return { width, height, data } }
const pixel = (canvas, x, y, color) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return; color.forEach((value, channel) => { canvas.data[(y * canvas.width + x) * 4 + channel] = value }) }
const circle = (canvas, centerX, centerY, radius, color) => { for (let y = centerY - radius; y <= centerY + radius; y++) for (let x = centerX - radius; x <= centerX + radius; x++) if ((x - centerX) ** 2 + (y - centerY) ** 2 <= radius ** 2) pixel(canvas, x, y, color) }
const line = (canvas, x1, y1, x2, y2, width, color) => { const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1)); for (let step = 0; step <= steps; step++) { const ratio = step / steps; circle(canvas, x1 + (x2 - x1) * ratio, y1 + (y2 - y1) * ratio, width / 2, color) } }
const polygon = (canvas, points, color) => { const start = Math.floor(Math.min(...points.map(point => point[1]))); const end = Math.ceil(Math.max(...points.map(point => point[1]))); for (let y = start; y <= end; y++) { const intersections = []; for (let current = 0, previous = points.length - 1; current < points.length; previous = current++) { const [x1, y1] = points[current]; const [x2, y2] = points[previous]; if ((y1 > y) !== (y2 > y)) intersections.push(x1 + (y - y1) * (x2 - x1) / (y2 - y1)) } intersections.sort((a, b) => a - b); for (let i = 0; i < intersections.length; i += 2) for (let x = Math.ceil(intersections[i]); x <= Math.floor(intersections[i + 1]); x++) pixel(canvas, x, y, color) } }
const lantern = (canvas, centerX, centerY, size) => {
  line(canvas, centerX - size * .12, centerY - size * .34, centerX - size * .12, centerY - size * .43, size * .045, palette.gold)
  line(canvas, centerX + size * .12, centerY - size * .34, centerX + size * .12, centerY - size * .43, size * .045, palette.gold)
  line(canvas, centerX - size * .12, centerY - size * .43, centerX + size * .12, centerY - size * .43, size * .045, palette.gold)
  polygon(canvas, [[centerX - size * .25, centerY - size * .32], [centerX + size * .25, centerY - size * .32], [centerX + size * .34, centerY + size * .34], [centerX - size * .34, centerY + size * .34]], palette.gold)
  polygon(canvas, [[centerX - size * .16, centerY - size * .2], [centerX + size * .16, centerY - size * .2], [centerX + size * .22, centerY + size * .2], [centerX - size * .22, centerY + size * .2]], palette.navy)
  polygon(canvas, [[centerX, centerY - size * .12], [centerX + size * .1, centerY + size * .08], [centerX, centerY + size * .17], [centerX - size * .1, centerY + size * .08]], palette.ivory)
  line(canvas, centerX - size * .38, centerY + size * .38, centerX + size * .38, centerY + size * .38, size * .055, palette.gold)
}
const saveIcon = (size, path) => { const canvas = image(size, size, palette.navy); lantern(canvas, size / 2, size / 2, size * .72); writeFileSync(path, encodePng(canvas)) }
for (const [size, path] of [[16, 'public/favicon-16x16.png'], [32, 'public/favicon-32x32.png'], [180, 'public/apple-touch-icon.png'], [192, 'public/android-chrome-192x192.png'], [512, 'public/android-chrome-512x512.png']]) saveIcon(size, path)

const profile = image(1080, 1080, palette.navy); circle(profile, 540, 540, 394, palette.gold); circle(profile, 540, 540, 386, palette.surface); lantern(profile, 540, 520, 520); writeFileSync('public/lentera-profile.png', encodePng(profile))
const og = image(1200, 630, palette.navy); circle(og, 985, 315, 190, palette.surface); lantern(og, 985, 300, 260); writeFileSync('public/og-image.png', encodePng(og))

const iconPng = readFileSync('public/favicon-32x32.png'); const icoHeader = Buffer.alloc(22); icoHeader.writeUInt16LE(1, 2); icoHeader.writeUInt16LE(1, 4); icoHeader[6] = 32; icoHeader[7] = 32; icoHeader.writeUInt16LE(1, 10); icoHeader.writeUInt16LE(32, 12); icoHeader.writeUInt32LE(iconPng.length, 14); icoHeader.writeUInt32LE(22, 18); writeFileSync('public/favicon.ico', Buffer.concat([icoHeader, iconPng]))
console.log('Generated Lentera favicon, app icon, and social raster assets.')
