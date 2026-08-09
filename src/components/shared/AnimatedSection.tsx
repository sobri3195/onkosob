import { type HTMLAttributes, type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type AnimatedSectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  as?: 'section' | 'div'
}

export function AnimatedSection({ children, delay = 0, direction = 'up', as = 'section', className, style, ...props }: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const Tag = as
  return <Tag ref={ref as never} className={cn('reveal', `reveal-${direction}`, visible && 'is-visible', className)} style={{ ...style, transitionDelay: `${delay}s` }} {...props}>{children}</Tag>
}

