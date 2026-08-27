export function RouteSkeleton({ label = 'Menyiapkan halaman…' }: { label?: string }) {
  return <div className='route-skeleton' role='status' aria-live='polite'>
    <span className='sr-only'>{label}</span>
    <div className='route-skeleton__head shimmer' />
    <div className='route-skeleton__line shimmer' />
    <div className='route-skeleton__line route-skeleton__line--short shimmer' />
    <div className='route-skeleton__grid'>{[0,1,2].map(item=><div className='route-skeleton__card shimmer' key={item}/>)}</div>
  </div>
}
