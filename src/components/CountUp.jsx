import { useEffect, useState } from 'react'

export default function CountUp({ to, suffix = '' }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf, start
    const tick = (ts) => {
      start ??= ts
      const p = Math.min((ts - start) / 1400, 1)
      setN(Math.round(to * (1 - (1 - p) ** 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return <>{n}{suffix}</>
}
