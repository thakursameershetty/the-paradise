"use client"

import React from "react"
import { createPortal } from "react-dom"
import { AnimationSequence, useAnimate } from "motion/react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface LikeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  liked?: boolean;
  onLikeChange?: (liked: boolean) => void;
  iconCount?: number;
}

export function LikeButton({
  className,
  children,
  liked = false,
  onLikeChange,
  iconCount = 20,
  style,
  ...props
}: LikeButtonProps) {
  const [scope, animate] = useAnimate()
  const btnRef = React.useRef<HTMLButtonElement>(null)
  const [burstOrigin, setBurstOrigin] = React.useState({ x: 0, y: 0 })
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const randomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onLikeChange) onLikeChange(!liked)
    props.onClick?.(e)

    if (!liked && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setBurstOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })

      const icons = Array.from({ length: iconCount })
      const iconsAnimation = icons.map((_, i) => [
        `.icon-${i}`,
        { x: randomNumber(-100, 100), y: randomNumber(-100, 100), opacity: [1, 0], scale: [randomNumber(1, 1.5), 0] },
        { duration: 0.7, at: "<" },
      ])
      const iconsReset = icons.map((_, i) => [`.icon-${i}`, { x: 0, y: 0 }, { duration: 0.000001 }])
      animate([...iconsReset, ...iconsAnimation] as AnimationSequence)
    }
  }

  return (
    <>
      <button
        ref={btnRef}
        {...props}
        onClick={handleClick}
        className={cn("relative inline-flex cursor-pointer items-center justify-center transition-all disabled:pointer-events-none disabled:opacity-50", className)}
        style={style}
      >
        {children}
      </button>
      {mounted && createPortal(
        <div
          ref={scope}
          aria-hidden
          className="pointer-events-none fixed z-[9999]"
          style={{ left: burstOrigin.x, top: burstOrigin.y }}
        >
          {Array.from({ length: iconCount }).map((_, i) => (
            <Heart key={i} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 fill-current opacity-0 text-red-500 icon-${i}`} />
          ))}
        </div>,
        document.body
      )}
    </>
  )
}
