import { useState } from "react"
import { Sparkles, Building2, Mail, Phone, Globe, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { cn } from "../lib/utils"

export const LogoWatermark = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Logo Watermark - Enhanced to be more clickable and engaging */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed top-4 left-4 z-50 flex items-center gap-2 rounded-lg border-4 border-black bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 p-3 neobrutalism relative overflow-hidden",
          "hover:shadow-[12px_12px_0px_0px_#000] transition-all hover:scale-110",
          "animate-bounce-subtle cursor-pointer group",
          "shadow-[8px_8px_0px_0px_#000]"
        )}
        aria-label="Click to learn more about Shona Prince Technologies"
        title="Click to learn more about Shona Prince Technologies"
      >
        {/* Shimmer overlay effect */}
        <div className="absolute inset-0 logo-shimmer pointer-events-none"></div>
        
        {/* Animated sparkles icon with rotation */}
        <Sparkles className="h-6 w-6 text-black animate-spin-slow group-hover:animate-spin relative z-10" />
        <span className="text-lg font-black text-black uppercase tracking-tight hidden sm:inline group-hover:scale-110 transition-transform relative z-10">
          SPT
        </span>
        
        {/* Pulsing notification dot indicator */}
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-black animate-ping z-20"></span>
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-black z-20"></span>
        
        {/* Tooltip text on hover */}
        <span className="absolute left-full ml-2 px-3 py-1 bg-black text-white text-xs font-bold uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded border-2 border-white z-30 shadow-lg">
          Click for Info! ✨
        </span>
      </button>

      {/* Information Dialog 
          Fixed to prevent exceeding viewport boundaries:
          - max-h-[90vh] ensures dialog doesn't exceed 90% of viewport height
          - overflow-y-auto enables scrolling when content exceeds max height
          - sm:max-w-[500px] limits width on larger screens for better readability
      */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-black" />
              Shona Prince Technologies
            </DialogTitle>
            <DialogDescription>
              Leading technology solutions provider
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="rounded-lg border-4 border-black bg-white p-4 neobrutalism-sm">
              <h3 className="text-lg font-black text-black uppercase mb-3">
                About Us
              </h3>
              <p className="text-sm font-medium text-gray-700">
                Shona Prince Technologies is a Zimbabwean-based cutting-edge software development
                company specializing in modern web applications, mobile solutions, and
                innovative technology services. We deliver high-quality, scalable
                solutions tailored to your business needs, serving clients globally from our base in Zimbabwe.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border-2 border-black bg-white p-3 neobrutalism-sm hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                <Building2 className="h-5 w-5 text-black flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Company</p>
                  <p className="text-sm font-black text-black">Shona Prince Technologies</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border-2 border-black bg-white p-3 neobrutalism-sm hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                <Mail className="h-5 w-5 text-black flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Email</p>
                  <p className="text-sm font-black text-black">info@shonaprince.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border-2 border-black bg-white p-3 neobrutalism-sm hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                <Phone className="h-5 w-5 text-black flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Phone</p>
                  <p className="text-sm font-black text-black">+263 (0) 77 123 4567</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border-2 border-black bg-white p-3 neobrutalism-sm hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                <Globe className="h-5 w-5 text-black flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Website</p>
                  <p className="text-sm font-black text-black">www.shonaprince.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border-2 border-black bg-white p-3 neobrutalism-sm hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                <MapPin className="h-5 w-5 text-black flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Location</p>
                  <p className="text-sm font-black text-black">Harare, Zimbabwe</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-4 border-black bg-gradient-to-r from-purple-400 to-pink-400 p-4 neobrutalism-sm">
              <h3 className="text-lg font-black text-black uppercase mb-2">
                Our Services
              </h3>
              <ul className="space-y-1 text-sm font-bold text-black">
                <li>• Web Application Development</li>
                <li>• Mobile App Development</li>
                <li>• Cloud Solutions & DevOps</li>
                <li>• UI/UX Design</li>
                <li>• Technology Consulting</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

