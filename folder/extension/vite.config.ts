import {defineConfig,type Plugin}from'vite'
import react from'@vitejs/plugin-react'
import {readFileSync}from'node:fs'
const entry=(path:string)=>new URL(path,import.meta.url).pathname
const manifestPlugin:Plugin={name:'lentera-manifest',generateBundle(){this.emitFile({type:'asset',fileName:'manifest.json',source:readFileSync(new URL('./manifest.json',import.meta.url),'utf8')})}}
export default defineConfig({plugins:[react(),manifestPlugin],build:{outDir:'dist',emptyOutDir:true,rollupOptions:{input:{popup:entry('./src/popup/popup.html'),options:entry('./src/options/options.html'),background:entry('./src/background/service-worker.ts'),content:entry('./src/content/content-script.ts')},output:{entryFileNames:'assets/[name].js',chunkFileNames:'assets/[name].js',assetFileNames:'assets/[name][extname]'}}}})
