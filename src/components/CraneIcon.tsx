export function CraneIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      fill="currentColor"
    >
      <path d="M50 10 L70 30 L65 35 L50 25 L35 35 L30 30 Z" />
      <path d="M50 25 L50 50 L30 70 L25 65 L45 45 Z" />
      <path d="M50 50 L70 70 L75 65 L55 45 Z" />
      <path d="M50 50 L50 85 L45 85 L45 50 Z" />
      <circle cx="48" cy="18" r="2" />
    </svg>
  )
}