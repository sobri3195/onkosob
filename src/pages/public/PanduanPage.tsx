import type { Store } from '@/store/useLocalStore'

export function PanduanPage({store,onCheck}:{store:Store;onCheck:(item:string)=>void}) {
  const steps=['Sebelum terapi: konsultasi dan persiapan berkas.','Saat terapi: ikuti arahan radiografer.','Sesudah terapi: pantau efek samping dan kontrol.']
  return <div><h1 className='text-2xl font-semibold'>Panduan Terapi Radiasi</h1><ol className='list-decimal pl-5'>{steps.map(s=><li key={s}>{s}</li>)}</ol><h2 className='mt-4 font-semibold'>Checklist Pasien</h2>{store.checklist.map(item=><label key={item} className='block'><input type='checkbox' checked={store.checkedItems.includes(item)} onChange={()=>onCheck(item)} /> {item}</label>)}</div>
}
