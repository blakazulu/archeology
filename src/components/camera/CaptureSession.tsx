import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Camera, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CameraView } from './CameraView';
import { CapturePreview } from './CapturePreview';
import { cn } from '@/lib/utils';
import { useCaptureStore } from '@/stores';
import type { ImageAngle } from '@/types';

const CAPTURE_ANGLES: ImageAngle[] = ['front', 'back', 'left', 'right', 'top', 'detail'];

type CaptureMode = 'single' | 'multi';

interface CaptureSessionProps {
  mode: CaptureMode;
  onComplete: (images: Array<{ blob: Blob; angle: ImageAngle }>) => void;
  onCancel: () => void;
}

interface CapturedImage {
  id: string;
  blob: Blob;
  angle: ImageAngle;
}

export function CaptureSession({ mode, onComplete, onCancel }: CaptureSessionProps) {
  const { t } = useTranslation();
  const [isCapturing, setIsCapturing] = useState(true);
  const [currentAngleIndex, setCurrentAngleIndex] = useState(0);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

  const { addCapturedImage, clearCapturedImages } = useCaptureStore();

  // Angle key mapping for translations
  const getAngleLabel = (angle: ImageAngle): string => {
    const angleKeys: Record<ImageAngle, string> = {
      front: 'front',
      back: 'back',
      left: 'leftSide',
      right: 'rightSide',
      top: 'top',
      bottom: 'top', // No bottom in translations, using top as fallback
      detail: 'detail',
      context: 'detail', // No context in translations, using detail as fallback
    };
    return t(`pages.capture.angles.${angleKeys[angle]}`);
  };

  const getAngleTip = (angle: ImageAngle): string => {
    const angleKeys: Record<ImageAngle, string> = {
      front: 'front',
      back: 'back',
      left: 'leftSide',
      right: 'rightSide',
      top: 'top',
      bottom: 'top',
      detail: 'detail',
      context: 'detail',
    };
    return t(`pages.capture.angleTips.${angleKeys[angle]}`);
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  // Get or create object URL for an image
  const getImageUrl = useCallback((image: CapturedImage): string => {
    const existing = imageUrls.get(image.id);
    if (existing) return existing;

    const url = URL.createObjectURL(image.blob);
    setImageUrls((prev) => new Map(prev).set(image.id, url));
    return url;
  }, [imageUrls]);

  const currentAngle = CAPTURE_ANGLES[currentAngleIndex];
  const currentAngleLabel = getAngleLabel(currentAngle);
  const currentAngleTip = getAngleTip(currentAngle);
  const isSingleMode = mode === 'single';
  const requiredAngles = isSingleMode ? 1 : 3; // At least 3 for multi-mode
  const hasEnoughImages = capturedImages.length >= requiredAngles;

  const handleCapture = useCallback((blob: Blob) => {
    setPendingBlob(blob);
    setIsCapturing(false);
  }, []);

  const handleConfirmCapture = useCallback(() => {
    if (!pendingBlob) return;

    const newImage: CapturedImage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      blob: pendingBlob,
      angle: currentAngle,
    };

    setCapturedImages((prev) => [...prev, newImage]);
    addCapturedImage({
      id: newImage.id,
      blob: newImage.blob,
      angle: newImage.angle,
      timestamp: new Date(),
    });

    setPendingBlob(null);

    // In single mode, complete immediately
    if (isSingleMode) {
      onComplete([{ blob: newImage.blob, angle: newImage.angle }]);
      return;
    }

    // In multi mode, move to next angle or show completion
    if (currentAngleIndex < CAPTURE_ANGLES.length - 1) {
      setCurrentAngleIndex((prev) => prev + 1);
    }
    setIsCapturing(true);
  }, [pendingBlob, currentAngle, isSingleMode, currentAngleIndex, addCapturedImage, onComplete]);

  const handleRetake = useCallback(() => {
    setPendingBlob(null);
    setIsCapturing(true);
  }, []);

  const handleDiscard = useCallback(() => {
    setPendingBlob(null);
    setIsCapturing(true);
  }, []);

  const handleDeleteImage = useCallback((id: string) => {
    // Revoke the URL to prevent memory leak
    const url = imageUrls.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      setImageUrls((prev) => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    }
    setCapturedImages((prev) => prev.filter((img) => img.id !== id));
  }, [imageUrls]);

  const handleComplete = useCallback(() => {
    const images = capturedImages.map(({ blob, angle }) => ({ blob, angle }));
    clearCapturedImages();
    onComplete(images);
  }, [capturedImages, clearCapturedImages, onComplete]);

  const handleCancel = useCallback(() => {
    clearCapturedImages();
    onCancel();
  }, [clearCapturedImages, onCancel]);

  // Show preview if we have a pending blob
  if (pendingBlob) {
    return (
      <CapturePreview
        imageBlob={pendingBlob}
        onConfirm={handleConfirmCapture}
        onRetake={handleRetake}
        onDiscard={handleDiscard}
      />
    );
  }

  // Show camera if capturing
  if (isCapturing) {
    return (
      <div className="fixed inset-0 z-[100]">
        <CameraView
          onCapture={handleCapture}
          onClose={handleCancel}
        />

        {/* Multi-mode angle indicator */}
        {!isSingleMode && (
          <div className="fixed bottom-32 left-0 right-0 z-[110] px-4">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 mx-auto max-w-sm">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setCurrentAngleIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentAngleIndex === 0}
                  className="p-2 text-white/60 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <p className="text-bone-white font-medium">{currentAngleLabel}</p>
                  <p className="text-bone-white/60 text-xs">{currentAngleTip}</p>
                </div>
                <button
                  onClick={() => setCurrentAngleIndex((prev) => Math.min(CAPTURE_ANGLES.length - 1, prev + 1))}
                  disabled={currentAngleIndex === CAPTURE_ANGLES.length - 1}
                  className="p-2 text-white/60 hover:text-white disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Angle dots */}
              <div className="flex items-center justify-center gap-2">
                {CAPTURE_ANGLES.map((angle, idx) => {
                  const isCaptured = capturedImages.some((img) => img.angle === angle);
                  const isCurrent = idx === currentAngleIndex;

                  return (
                    <button
                      key={angle}
                      onClick={() => setCurrentAngleIndex(idx)}
                      className={cn(
                        'w-3 h-3 rounded-full transition-all',
                        isCaptured
                          ? 'bg-oxidized-bronze'
                          : isCurrent
                          ? 'bg-terracotta'
                          : 'bg-white/30'
                      )}
                    />
                  );
                })}
              </div>

              {/* Progress and complete button */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-bone-white/60 text-sm">
                  {capturedImages.length} / {CAPTURE_ANGLES.length} {t('components.captureSession.captured')}
                </span>
                {hasEnoughImages && (
                  <button
                    onClick={handleComplete}
                    className="flex items-center gap-2 px-4 py-2 bg-oxidized-bronze text-white rounded-lg text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    {t('components.captureSession.done')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Multi-mode gallery view (when not actively capturing)
  return (
    <div className="fixed inset-0 z-[100] bg-parchment">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-desert-sand safe-area-top">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCancel}
              className="text-stone-gray hover:text-charcoal"
            >
              {t('components.captureSession.cancel')}
            </button>
            <h2 className="font-heading text-lg font-semibold text-charcoal">
              {t('components.captureSession.capturedPhotos')}
            </h2>
            <button
              onClick={handleComplete}
              disabled={!hasEnoughImages}
              className="text-terracotta font-medium disabled:opacity-50"
            >
              {t('components.captureSession.done')}
            </button>
          </div>
        </div>

        {/* Image grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {capturedImages.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square rounded-xl overflow-hidden bg-aged-paper border border-desert-sand"
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${getAngleLabel(image.angle)} view`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-bone-white text-xs font-medium capitalize">
                    {getAngleLabel(image.angle)}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-rust-red transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Add more button */}
            <button
              onClick={() => setIsCapturing(true)}
              className="aspect-square rounded-xl border-2 border-dashed border-desert-sand bg-aged-paper flex flex-col items-center justify-center text-stone-gray hover:border-terracotta hover:text-terracotta transition-colors"
            >
              <Camera className="w-8 h-8 mb-2" />
              <span className="text-sm">{t('components.captureSession.addPhoto')}</span>
            </button>
          </div>
        </div>

        {/* Bottom status */}
        <div className="p-4 border-t border-desert-sand safe-area-bottom">
          <p className="text-center text-stone-gray text-sm">
            {hasEnoughImages
              ? t('components.captureSession.photosCount', { count: capturedImages.length, total: CAPTURE_ANGLES.length })
              : t('components.captureSession.minimumPhotos', { count: requiredAngles })}
          </p>
        </div>
      </div>
    </div>
  );
}
