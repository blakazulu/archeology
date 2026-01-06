import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Upload, Info, Zap, Layers, Box, Sparkles, FolderOpen, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CaptureSession, FileUpload } from '@/components/camera';
import { cn } from '@/lib/utils';
import { compressImage, generateId } from '@/lib/utils';
import { db } from '@/lib/db';
import { useAppStore } from '@/stores';
import type { ImageAngle, Artifact } from '@/types';

type CaptureMethod = 'camera' | 'upload' | null;
type ReconstructionMode = 'single' | 'multi';

export function SaveThePastPage() {
  const navigate = useNavigate();
  const { setCurrentArtifact, setProcessingStatus } = useAppStore();
  const { t } = useTranslation();

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
        metadata: {
          captureMode: 'save', // Mark as Save the Past artifact
        },
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

      // Navigate to Save artifact detail page
      navigate(`/save/artifact/${artifactId}`);
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
    <div className="px-4 py-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-terracotta to-clay mb-4">
          <Box className="w-8 h-8 text-bone-white" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-sienna mb-2">
          {t('pages.home.saveThePast')}
        </h2>
        <p className="text-stone-gray">
          {t('pages.home.saveThePastDesc')}
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sienna/10 text-sienna text-sm font-medium">
          <Box className="w-4 h-4" />
          {t('pages.home.features.3dModels')}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-oxidized-bronze/10 text-oxidized-bronze text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          {t('pages.home.features.aiAnalysis')}
        </span>
      </div>

      {/* Info Banner */}
      <div className="mb-6 rounded-xl bg-terracotta/10 border border-terracotta/30 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-terracotta shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-terracotta">
              {t('pages.capture.forBestResults')}
            </p>
            <p className="text-stone-gray mt-1">
              {t('pages.capture.captureMultipleAngles')}
            </p>
          </div>
        </div>
      </div>

      {/* Reconstruction Mode Selector */}
      <div className="mb-6">
        <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">
          {t('pages.capture.reconstructionMode')}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setReconstructionMode('single')}
            className={cn(
              'rounded-xl p-4 text-left rtl:text-right transition-all',
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
                {t('pages.capture.singlePhoto')}
              </h4>
            </div>
            <p className="text-xs text-stone-gray">
              {t('pages.capture.singlePhotoDesc')}
            </p>
          </button>

          <button
            onClick={() => setReconstructionMode('multi')}
            className={cn(
              'rounded-xl p-4 text-left rtl:text-right transition-all',
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
                {t('pages.capture.multiPhoto')}
              </h4>
            </div>
            <p className="text-xs text-stone-gray">
              {t('pages.capture.multiPhotoDesc')}
            </p>
          </button>
        </div>
      </div>

      {/* Capture Options */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-charcoal">
          {t('pages.capture.chooseCaptureMethod')}
        </h3>

        <button
          className="w-full flex items-center gap-4 rounded-xl bg-terracotta p-5 text-left rtl:text-right text-bone-white shadow-md transition-all hover:bg-clay active:scale-[0.98]"
          onClick={() => setCaptureMethod('camera')}
        >
          <div className="rounded-full bg-bone-white/20 p-3">
            <Camera className="h-8 w-8" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">{t('pages.capture.useCamera')}</h4>
            <p className="text-bone-white/80 text-sm">
              {t('pages.capture.useCameraDesc')}
            </p>
          </div>
        </button>

        <button
          className="w-full flex items-center gap-4 rounded-xl bg-aged-paper border-2 border-dashed border-desert-sand p-5 text-left rtl:text-right transition-all hover:border-clay hover:bg-parchment active:scale-[0.98]"
          onClick={() => setCaptureMethod('upload')}
        >
          <div className="rounded-full bg-sienna/10 p-3">
            <Upload className="h-8 w-8 text-sienna" />
          </div>
          <div>
            <h4 className="font-semibold text-lg text-charcoal">{t('pages.capture.uploadFiles')}</h4>
            <p className="text-stone-gray text-sm">
              {t('pages.capture.uploadFilesDesc')}
            </p>
          </div>
        </button>
      </div>

      {/* View Gallery Link */}
      <div className="mt-8">
        <Link
          to="/save/gallery"
          className="flex items-center justify-between rounded-xl bg-aged-paper border border-desert-sand p-4 transition-all hover:border-terracotta hover:bg-parchment"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-sienna/10 p-2">
              <FolderOpen className="h-5 w-5 text-sienna" />
            </div>
            <div>
              <h4 className="font-medium text-charcoal">{t('pages.save.viewGallery')}</h4>
              <p className="text-sm text-stone-gray">{t('pages.save.viewGalleryDesc')}</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-stone-gray rtl:rotate-180" />
        </Link>
      </div>

      {/* Tips */}
      <div className="mt-8">
        <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">
          {t('pages.capture.captureTips')}
        </h3>
        <ul className="space-y-2 text-sm text-stone-gray">
          <li className="flex gap-2">
            <span className="text-terracotta">•</span>
            {t('pages.capture.tips.lighting')}
          </li>
          <li className="flex gap-2">
            <span className="text-terracotta">•</span>
            {t('pages.capture.tips.background')}
          </li>
          <li className="flex gap-2">
            <span className="text-terracotta">•</span>
            {t('pages.capture.tips.shadows')}
          </li>
          <li className="flex gap-2">
            <span className="text-terracotta">•</span>
            {t('pages.capture.tips.scale')}
          </li>
        </ul>
      </div>
    </div>
  );
}
