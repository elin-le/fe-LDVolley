import { useEffect, useRef, useState } from 'react'

// Slides children in once when scrolled into view. `from` sets the direction (sideways only from md up).
// Exposes data-shown so descendants can animate with `in-data-[shown=true]:*`.
const hidden = {
  up: 'translate-y-8',
  left: 'translate-y-8 md:translate-y-0 md:-translate-x-16',
  right: 'translate-y-8 md:translate-y-0 md:translate-x-16',
}

export default function Reveal({ as: Tag = 'div', from = 'up', className = '', children }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect() }
    }, { threshold: 0.15 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} data-shown={shown} className={`transition duration-700 ease-out ${shown ? 'translate-x-0 translate-y-0 opacity-100' : `${hidden[from]} opacity-0`} ${className}`}>
      {children}
    </Tag>
  )
}
