import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Upload, Info, Palette, Layers, FolderOpen, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CaptureSession, FileUpload } from '@/components/camera';
import { compressImage, generateId } from '@/lib/utils';
import { db } from '@/lib/db';
import { useAppStore } from '@/stores';
import type { ImageAngle, Artifact } from '@/types';

type CaptureMethod = 'camera' | 'upload' | null;

export function PastPalettePage() {
  const navigate = useNavigate();
  const { setCurrentArtifact, setProcessingStatus } = useAppStore();
  const { t } = useTranslation();

  const [captureMethod, setCaptureMethod] = useState<CaptureMethod>(null);

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
          captureMode: 'palette', // Mark as Past Palette artifact
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

      // Navigate to Palette artifact detail page
      navigate(`/palette/artifact/${artifactId}`);
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
        mode="single"
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
        maxFiles={1}
      />
    );
  }

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-desert-teal to-oxidized-bronze mb-4">
          <Palette className="w-8 h-8 text-bone-white" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-desert-teal mb-2">
          {t('pages.home.pastPalette')}
        </h2>
        <p className="text-stone-gray">
          {t('pages.home.pastPaletteDesc')}
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-desert-teal/10 text-desert-teal text-sm font-medium">
          <Palette className="w-4 h-4" />
          {t('pages.home.features.colorization')}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-ochre/10 text-gold-ochre text-sm font-medium">
          <Layers className="w-4 h-4" />
          {t('pages.home.features.multiStyle')}
        </span>
      </div>

      {/* Info Banner */}
      <div className="mb-6 rounded-xl bg-desert-teal/10 border border-desert-teal/30 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-desert-teal shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-desert-teal">
              {t('pages.capture.forBestColorization')}
            </p>
            <p className="text-stone-gray mt-1">
              {t('pages.capture.colorizationDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Capture Options */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-charcoal">
          {t('pages.capture.addYourPhoto')}
        </h3>

        <button
          className="w-full flex items-center gap-4 rounded-xl bg-desert-teal p-5 text-left text-bone-white shadow-md transition-all hover:bg-oxidized-bronze active:scale-[0.98] rtl:text-right"
          onClick={() => setCaptureMethod('camera')}
        >
          <div className="rounded-full bg-bone-white/20 p-3">
            <Camera className="h-8 w-8" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">{t('pages.capture.useCamera')}</h4>
            <p className="text-bone-white/80 text-sm">
              {t('pages.capture.takePhoto')}
            </p>
          </div>
        </button>

        <button
          className="w-full flex items-center gap-4 rounded-xl bg-aged-paper border-2 border-dashed border-desert-sand p-5 text-left transition-all hover:border-desert-teal hover:bg-parchment active:scale-[0.98] rtl:text-right"
          onClick={() => setCaptureMethod('upload')}
        >
          <div className="rounded-full bg-desert-teal/10 p-3">
            <Upload className="h-8 w-8 text-desert-teal" />
          </div>
          <div>
            <h4 className="font-semibold text-lg text-charcoal">{t('pages.capture.uploadPhoto')}</h4>
            <p className="text-stone-gray text-sm">
              {t('pages.capture.selectExisting')}
            </p>
          </div>
        </button>
      </div>

      {/* View Gallery Link */}
      <div className="mt-8">
        <Link
          to="/palette/gallery"
          className="flex items-center justify-between rounded-xl bg-aged-paper border border-desert-sand p-4 transition-all hover:border-desert-teal hover:bg-parchment"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-desert-teal/10 p-2">
              <FolderOpen className="h-5 w-5 text-desert-teal" />
            </div>
            <div>
              <h4 className="font-medium text-charcoal">{t('pages.palette.viewGallery')}</h4>
              <p className="text-sm text-stone-gray">{t('pages.palette.viewGalleryDesc')}</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-stone-gray rtl:rotate-180" />
        </Link>
      </div>

      {/* Color Scheme Preview */}
      <div className="mt-8">
        <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">
          {t('pages.capture.availableSchemes')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <ColorSchemePreview name={t('pages.capture.schemes.roman')} colors={['#8B0000', '#FFD700', '#FFFFFF', '#000080']} />
          <ColorSchemePreview name={t('pages.capture.schemes.greek')} colors={['#1E90FF', '#FFD700', '#FFFFFF', '#8B4513']} />
          <ColorSchemePreview name={t('pages.capture.schemes.egyptian')} colors={['#FFD700', '#00CED1', '#8B4513', '#228B22']} />
          <ColorSchemePreview name={t('pages.capture.schemes.original')} colors={['#C65D3B', '#8B4513', '#D4A574', '#4A7C59']} />
        </div>
      </div>
    </div>
  );
}

function ColorSchemePreview({ name, colors }: { name: string; colors: string[] }) {
  return (
    <div className="rounded-xl bg-aged-paper border border-desert-sand p-3">
      <div className="flex gap-1 mb-2">
        {colors.map((color, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border border-desert-sand/50"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-charcoal">{name}</p>
    </div>
  );
}
