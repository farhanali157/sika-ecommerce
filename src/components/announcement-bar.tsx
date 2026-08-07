"use client"

export function AnnouncementBar({
  messages,
  bgColor,
  textColor,
  isActive,
}: {
  messages: string[]
  bgColor: string
  textColor: string
  isActive: boolean
}) {
  if (!isActive || !messages || messages.length === 0) return null

  // Duplicate the array sequences to create a seamless infinite marquee track
  const sequence = [...messages, ...messages, ...messages, ...messages]

  return (
    <div
      className="w-full overflow-hidden py-2 text-xs font-bold tracking-widest uppercase whitespace-nowrap shadow-xs select-none"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="flex w-max animate-marquee">
        {sequence.map((msg, index) => (
          <div key={index} className="flex items-center shrink-0">
            <span className="mx-8">{msg}</span>
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