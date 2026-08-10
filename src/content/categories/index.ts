import type { ContentCategory } from '@/types/content'

const definitions = [
  ['dasar-kanker','Dasar Kanker','Konsep dasar untuk memahami kanker.','BookOpen'],['diagnosis','Diagnosis','Pemeriksaan untuk membantu mengenali penyakit.','Search'],
  ['patologi','Patologi','Memahami jaringan, sel, dan laporan patologi.','Microscope'],['staging','Staging','Memahami luas penyakit dan sistem stadium.','Waypoints'],
  ['operasi','Operasi','Persiapan dan pemulihan tindakan bedah.','HeartPulse'],['kemoterapi','Kemoterapi','Gambaran terapi obat antikanker.','FlaskConical'],
  ['radioterapi','Radioterapi','Informasi tentang terapi radiasi.','Radiation'],['imunoterapi','Imunoterapi','Informasi umum terapi berbasis sistem imun.','Shield'],
  ['targeted-therapy','Targeted Therapy','Terapi yang menargetkan karakteristik tertentu.','Target'],['hormonal-therapy','Hormonal Therapy','Terapi hormonal dalam konteks kanker.','Activity'],
  ['efek-samping','Efek Samping','Mengenali dan melaporkan dampak terapi.','TriangleAlert'],['nutrisi','Nutrisi','Dukungan makan dan minum selama perawatan.','Apple'],
  ['aktivitas-fisik','Aktivitas Fisik','Bergerak secara aman sesuai kondisi.','Footprints'],['psikososial','Psikososial','Dukungan emosi dan sosial.','HeartHandshake'],
  ['caregiver','Caregiver','Panduan bagi pendamping pasien.','Users'],['paliatif','Paliatif','Dukungan kualitas hidup dan gejala.','HandHeart'],
  ['survivorship','Survivorship','Kehidupan dan pemantauan setelah terapi.','Sunrise'],
] as const

export const categories: ContentCategory[] = definitions.map(([slug,title,description,icon]) => ({ id: slug, slug, title, description, icon, articleCount: 0 }))
export const categoryById = (id: string) => categories.find(category => category.id === id)
