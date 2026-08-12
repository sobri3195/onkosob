export const LENTERA_BASE_URL='https://onkosob.vercel.app'
export const STORAGE_KEY='lentera_extension_v1'
export const MAX_SELECTION_LENGTH=5000
export function isSafeWebUrl(value:string){try{return ['http:','https:'].includes(new URL(value).protocol)}catch{return false}}
