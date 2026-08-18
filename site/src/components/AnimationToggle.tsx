import { useState } from "react"

export default function AnimationToggle() {
  const [animations, setAnimations] = useState(true)

  const toggle = () => {
    const next = !animations
    setAnimations(next)
    document.documentElement.classList.toggle("animations-off", !next)
  }

  return (
    <button
      onClick={toggle}
      title={animations ? "Animations: running" : "Animations: paused"}
      aria-label="toggle animations"
      className="fixed top-4 right-12 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-stone-800 text-stone-300 transition-colors hover:text-yellow-400"
    >
      {animations ? (
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
          <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  )
}
