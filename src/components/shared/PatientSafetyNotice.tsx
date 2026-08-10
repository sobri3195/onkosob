import { Link } from 'react-router-dom'
export function PatientSafetyNotice({variant='general'}:{variant?:'general'|'symptom'|'medications'|'emergency'}){
 const copy={general:'Lentera membantu mengatur informasi yang Anda masukkan dan tidak memberikan keputusan medis.',symptom:'Catatan ini bukan pemeriksa gejala dan tidak membuat diagnosis.',medications:'Masukkan obat sesuai instruksi dari dokter atau tenaga kesehatan yang menangani Anda.',emergency:'Gejala tertentu dapat membutuhkan evaluasi segera. Bila kondisi terasa berat, memburuk cepat, atau termasuk tanda bahaya yang telah dijelaskan oleh tim medis Anda, segera cari pertolongan medis.'}[variant]
 return <aside className={`patient-safety ${variant}`} role={variant==='emergency'?'alert':'note'}><strong>{variant==='emergency'?'Perhatikan kondisi Anda':'Batas aman Lentera'}</strong><p>{copy}</p>{variant==='emergency'&&<Link to='/red-flags'>Lihat Tanda Bahaya</Link>}</aside>
}
