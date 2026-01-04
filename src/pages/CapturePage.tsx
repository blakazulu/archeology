import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Info, Zap, Layers } from 'lucide-react';
import { CaptureSession, FileUpload } from '@/components/camera';
import { cn } from '@/lib/utils';
import { compressImage, generateId } from '@/lib/utils';
import { db } from '@/lib/db';
import { useAppStore } from '@/stores';
import type { ImageAngle, Artifact } from '@/types';

type CaptureMethod = 'camera' | 'upload' | null;
type ReconstructionMode = 'single' | 'multi';

export function CapturePage() {
  const navigate = useNavigate();
  const { setCurrentArtifact, setProcessingStatus } = useAppStore();

  const [captureMethod, setCaptureMethod] = useState<CaptureMethod>(null);
  const [reconstructionMode, setReconstructionMode] = useState<ReconstructionMode>('single');

  const handleCaptureComplete = useCallback(async (images: Array<{ blob: Blob; angle: ImageAngle }>) => {
    try {
      const artifactId = generateId();

      const newArtifact: Artifact = {
        id: artifactId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'images-captured',
        imageIds: [],
        colorVariantIds: [],
        metadata: {},
      };

      const imageIds: string[] = [];

      for (const { blob, angle } of images) {
        const compressed = await compressImage(blob, 2, 1920);
        const imageId = generateId();

        await db.images.add({
          id: imageId,
          artifactId,
          blob: compressed,
          angle,
          createdAt: new Date(),
          width: 0,
          height: 0,
        });

        imageIds.push(imageId);
      }

      newArtifact.imageIds = imageIds;

      const thumbnailBlob = await compressImage(images[0].blob, 0.5, 400);
      newArtifact.thumbnailBlob = thumbnailBlob;

      await db.artifacts.add(newArtifact);

      setCurrentArtifact(artifactId);
      setProcessingStatus({
        artifactId,
        step: 'idle',
        progress: 0,
        message: 'Ready to process',
      });

      navigate(`/artifact/${artifactId}`);
    } catch (error) {
      console.error('Failed to save captured images:', error);
    }
  }, [navigate, setCurrentArtifact, setProcessingStatus]);

  const handleFileUploadComplete = useCallback(async (files: File[]) => {
    const images: Array<{ blob: Blob; angle: ImageAngle }> = files.map((file, index) => ({
      blob: file,
      angle: index === 0 ? 'front' : ('detail' as ImageAngle),
    }));
    await handleCaptureComplete(images);
  }, [handleCaptureComplete]);

  const handleCancel = useCallback(() => {
    setCaptureMethod(null);
  }, []);

  if (captureMethod === 'camera') {
    return (
      <CaptureSession
        mode={reconstructionMode}
        onComplete={handleCaptureComplete}
        onCancel={handleCancel}
      />
    );
  }

  if (captureMethod === 'upload') {
    return (
      <FileUpload
        onFilesSelected={handleFileUploadComplete}
        onCancel={handleCancel}
        maxFiles={reconstructionMode === 'single' ? 1 : 10}
      />
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Info Banner */}
      <div className="mb-6 rounded-xl bg-desert-teal/10 border border-desert-teal/30 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-desert-teal shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-desert-teal">
              For best results
            </p>
            <p className="text-stone-gray mt-1">
              Capture multiple angles of your artifact on a plain background with good lighting.
            </p>
          </div>
        </div>
      </div>

      {/* Reconstruction Mode Selector */}
      <div className="mb-6">
        <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">
          Reconstruction Mode
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setReconstructionMode('single')}
            className={cn(
              'rounded-xl p-4 text-left transition-all',
              reconstructionMode === 'single'
                ? 'border-2 border-terracotta bg-terracotta/5'
                : 'border border-desert-sand bg-aged-paper hover:border-clay'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className={cn(
                'w-5 h-5',
                reconstructionMode === 'single' ? 'text-terracotta' : 'text-stone-gray'
              )} />
              <h4 className={cn(
                'font-medium',
                reconstructionMode === 'single' ? 'text-terracotta' : 'text-charcoal'
              )}>
                Single Photo
              </h4>
            </div>
            <p className="text-xs text-stone-gray">
              Quick 3D from one image. Fast but less detailed.
            </p>
          </button>

          <button
            onClick={() => setReconstructionMode('multi')}
            className={cn(
              'rounded-xl p-4 text-left transition-all',
              reconstructionMode === 'multi'
                ? 'border-2 border-terracotta bg-terracotta/5'
                : 'border border-desert-sand bg-aged-paper hover:border-clay'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Layers className={cn(
                'w-5 h-5',
                reconstructionMode === 'multi' ? 'text-terracotta' : 'text-stone-gray'
              )} />
              <h4 className={cn(
                'font-medium',
                reconstructionMode === 'multi' ? 'text-terracotta' : 'text-charcoal'
              )}>
                Multi-Photo
              </h4>
            </div>
            <p className="text-xs text-stone-gray">
              Detailed 3D from multiple angles. More accurate.
            </p>
          </button>
        </div>
      </div>

      {/* Capture Options */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-charcoal">
          Choose Capture Method
        </h3>

        <button
          className="w-full flex items-center gap-4 rounded-xl bg-terracotta p-5 text-left text-bone-white shadow-md transition-all hover:bg-clay active:scale-[0.98]"
          onClick={() => setCaptureMethod('camera')}
        >
          <div className="rounded-full bg-bone-white/20 p-3">
            <Camera className="h-8 w-8" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Use Camera</h4>
            <p className="text-bone-white/80 text-sm">
              Capture photos directly from your device
            </p>
          </div>
        </button>

        <button
          className="w-full flex items-center gap-4 rounded-xl bg-aged-paper border-2 border-dashed border-desert-sand p-5 text-left transition-all hover:border-clay hover:bg-parchment active:scale-[0.98]"
          onClick={() => setCaptureMethod('upload')}
        >
          <div className="rounded-full bg-sienna/10 p-3">
            <Upload className="h-8 w-8 text-sienna" />
          </div>
          <div>
            <h4 className="font-semibold text-lg text-charcoal">Upload Files</h4>
            <p className="text-stone-gray text-sm">
              Select existing photos from your device
            </p>
          </div>
        </button>
      </div>

      {/* Tips */}
      <div className="mt-8">
        <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">
          Capture Tips
        </h3>
        <ul className="space-y-2 text-sm text-stone-gray">
          <li className="flex gap-2">
            <span className="text-terracotta">•</span>
            Use even, diffused lighting
          </li>
          <li className="flex gap-2">
            <span className="text-terracotta">•</span>
            Place artifact on a neutral background
          </li>
          <li className="flex gap-2">
            <span className="text-terracotta">•</span>
            Avoid harsh shadows
          </li>
          <li className="flex gap-2">
            <span className="text-terracotta">•</span>
            Include a scale reference if possible
          </li>
        </ul>
      </div>
    </div>
  );
}
