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

  // Create an array to repeat the message enough times to fill any screen size seamlessly
  const items = Array.from({ length: 10 }, (_, i) => i)

  return (
    <div
      className="w-full overflow-hidden py-2 text-xs font-bold tracking-widest uppercase whitespace-nowrap shadow-xs select-none"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="flex w-max animate-marquee">
        {items.map((i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="mx-8">{text}</span>
            <span className="mx-8 text-amber-400">•</span>
          </div>
        ))}
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
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}