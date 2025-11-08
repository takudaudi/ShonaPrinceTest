import { Sparkles } from "lucide-react"

const updates = [
  "🚀 New features added: Comments and Subtasks!",
  "✨ Enhanced UI with Neobrutalism design",
  "📅 Calendar view now available",
  "📋 Kanban board with drag & drop",
  "💬 Real-time updates and notifications",
  "🎨 Beautiful animations throughout",
  "⚡ Fast and responsive performance",
  "🔒 Secure and reliable",
]

export const Footer = () => {
  // Duplicate updates for seamless loop
  const scrollingUpdates = [...updates, ...updates]

  return (
    <footer className="mt-12 border-t-4 border-black bg-white neobrutalism">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Company Name */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Sparkles className="h-5 w-5 text-black animate-pulse" />
            <h3 className="text-xl font-black text-black uppercase tracking-tight whitespace-nowrap">
              Shona Prince Technologies
            </h3>
          </div>

          {/* Moving Updates Ticker */}
          <div className="flex-1 max-w-2xl w-full overflow-hidden relative">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-black uppercase whitespace-nowrap flex-shrink-0">
                Updates:
              </span>
              <div className="flex-1 overflow-hidden relative h-6">
                <div className="flex animate-scroll-left whitespace-nowrap">
                  {scrollingUpdates.map((update, index) => (
                    <span
                      key={index}
                      className="text-sm font-bold text-gray-700 uppercase px-4 inline-block"
                    >
                      {update}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-xs font-bold text-gray-600 uppercase whitespace-nowrap flex-shrink-0">
            © {new Date().getFullYear()} All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  )
}

