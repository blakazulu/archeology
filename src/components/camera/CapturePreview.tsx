import { useState, useEffect } from 'react';
import { Check, RotateCcw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface CapturePreviewProps {
  imageBlob: Blob;
  onConfirm: () => void;
  onRetake: () => void;
  onDiscard: () => void;
  className?: string;
}

export function CapturePreview({
  imageBlob,
  onConfirm,
  onRetake,
  onDiscard,
  className,
}: CapturePreviewProps) {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(imageBlob);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageBlob]);

  if (!imageUrl) return null;

  return (
    <div className={cn('fixed inset-0 z-[100] bg-black', className)}>
      {/* Preview image */}
      <img
        src={imageUrl}
        alt={t('components.capturePreview.capturedArtifact')}
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-4 safe-area-top bg-gradient-to-b from-black/60 to-transparent">
        <h2 className="text-bone-white text-center font-medium">
          {t('components.capturePreview.preview')}
        </h2>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 safe-area-bottom bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-center gap-6">
          {/* Discard button */}
          <button
            onClick={onDiscard}
            className="w-14 h-14 rounded-full bg-rust-red/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-rust-red transition-colors"
            aria-label={t('components.capturePreview.discardPhoto')}
          >
            <Trash2 className="w-6 h-6" />
          </button>

          {/* Retake button */}
          <button
            onClick={onRetake}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label={t('components.capturePreview.retakePhoto')}
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          {/* Confirm button */}
          <button
            onClick={onConfirm}
            className="w-16 h-16 rounded-full bg-oxidized-bronze flex items-center justify-center text-white hover:bg-oxidized-bronze/90 transition-colors"
            aria-label={t('components.capturePreview.useThisPhoto')}
          >
            <Check className="w-8 h-8" />
          </button>
        </div>

        <p className="text-center text-white/60 text-sm mt-4">
          {t('components.capturePreview.tapToUse')}
        </p>
      </div>
    </div>
  );
}
