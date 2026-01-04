import { cn } from '@/lib/utils';

interface CaptureOverlayProps {
  showGrid?: boolean;
  className?: string;
}

export function CaptureOverlay({ showGrid = true, className }: CaptureOverlayProps) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      {/* Corner brackets */}
      <div className="absolute inset-8 sm:inset-16 md:inset-24">
        {/* Top left corner */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-bone-white/60 rounded-tl-lg" />
        {/* Top right corner */}
        <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-bone-white/60 rounded-tr-lg" />
        {/* Bottom left corner */}
        <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-bone-white/60 rounded-bl-lg" />
        {/* Bottom right corner */}
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-bone-white/60 rounded-br-lg" />
      </div>

      {/* Grid overlay (rule of thirds) */}
      {showGrid && (
        <div className="absolute inset-8 sm:inset-16 md:inset-24">
          {/* Vertical lines */}
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-bone-white/20" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-bone-white/20" />
          {/* Horizontal lines */}
          <div className="absolute top-1/3 left-0 right-0 h-px bg-bone-white/20" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-bone-white/20" />
        </div>
      )}

      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-8 h-8">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-bone-white/40" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-bone-white/40" />
        </div>
      </div>

      {/* Tip text at bottom */}
      <div className="absolute left-0 right-0 bottom-32 sm:bottom-36 px-4">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 mx-auto max-w-xs text-center">
          <p className="text-bone-white/90 text-sm">
            Center the artifact in the frame
          </p>
        </div>
      </div>
    </div>
  );
}
