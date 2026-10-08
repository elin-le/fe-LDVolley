export default function BallMark({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="92" />
      <path d="M100 8c-10 40-8 80 12 118M100 8c40 12 72 40 86 84M14 70c40-6 80 8 112 56M186 92c-30 30-70 46-112 38M14 70c8 40 38 76 80 92" />
    </svg>
  )
}
