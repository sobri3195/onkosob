type LogoVariant = 'horizontal' | 'stacked' | 'mark'
type LogoTheme = 'dark' | 'light' | 'monochrome'
type LogoSize = 'sm' | 'md' | 'lg'

type BrandLogoProps = {
  variant?: LogoVariant
  theme?: LogoTheme
  size?: LogoSize
  decorative?: boolean
  className?: string
}

const dimensions = {
  horizontal: { viewBox: '0 0 310 72', sm: 154, md: 190, lg: 232 },
  stacked: { viewBox: '0 0 180 160', sm: 86, md: 112, lg: 140 },
  mark: { viewBox: '0 0 64 64', sm: 34, md: 42, lg: 54 },
} as const

function LanternMark({ theme }: { theme: LogoTheme }) {
  const main = theme === 'dark' ? '#D4A94D' : theme === 'monochrome' ? 'currentColor' : '#071426'
  const windowColor = theme === 'dark' ? '#071426' : theme === 'monochrome' ? 'transparent' : '#F7F2E8'
  const flame = theme === 'monochrome' ? 'currentColor' : theme === 'dark' ? '#F7F2E8' : '#D4A94D'
  return <>
    <path d='M24 17c0-5 3.6-9 8-9s8 4 8 9' stroke={main} strokeWidth='4' strokeLinecap='round'/>
    <path d='M20 19h24l5 34H15l5-34Z' fill={main}/>
    <path d='M23 25h18l2.8 21H20.2L23 25Z' fill={windowColor} stroke={theme === 'monochrome' ? 'currentColor' : 'none'} strokeWidth='2'/>
    <path className='brand-flame' d='M32 29c5.5 6.6 5.7 11.7 0 15-5.7-3.3-5.5-8.4 0-15Z' fill={flame}/>
    <path d='M13 54h38' stroke={main} strokeWidth='4' strokeLinecap='round'/>
  </>
}

export function BrandLogo({ variant = 'horizontal', theme = 'light', size = 'md', decorative = false, className = '' }: BrandLogoProps) {
  const config = dimensions[variant]
  const text = theme === 'dark' ? '#F7F2E8' : 'currentColor'
  const accent = theme === 'monochrome' ? 'currentColor' : '#D4A94D'
  return <svg className={`brand-logo brand-logo-${variant} ${className}`} viewBox={config.viewBox} width={config[size]} role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : 'Lentera Onko Vision'}>
    {variant === 'mark' ? <LanternMark theme={theme}/> : variant === 'horizontal' ? <>
      <g transform='translate(4 4) scale(.95)'><LanternMark theme={theme}/></g>
      <text x='76' y='34' fill={text} fontFamily='Georgia,serif' fontSize='26'>Lentera</text>
      <text x='77' y='53' fill={text} fontFamily='Arial,sans-serif' fontSize='11' letterSpacing='3.4'>ONKO VISION</text>
      <path d='M197 49h96' stroke={accent}/>
    </> : <>
      <g transform='translate(58 0)'><LanternMark theme={theme}/></g>
      <text x='90' y='102' textAnchor='middle' fill={text} fontFamily='Georgia,serif' fontSize='27'>LENTERA</text>
      <text x='90' y='128' textAnchor='middle' fill={text} fontFamily='Arial,sans-serif' fontSize='13' letterSpacing='3'>ONKO VISION</text>
      <path d='M39 142h102' stroke={accent}/>
    </>}
  </svg>
}
