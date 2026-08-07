"use client"

export function AnnouncementBar({
  text,
  bgColor,
  textColor,
  isActive,
}: {
  text: string
  bgColor: string
  textColor: string
  isActive: boolean
}) {
  if (!isActive || !text) return null

  return (
    <div
      className="sticky top-0 z-50 overflow-hidden py-2 text-xs font-bold tracking-widest uppercase whitespace-nowrap shadow-xs"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="inline-flex animate-marquee gap-16">
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          width: 200%;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}