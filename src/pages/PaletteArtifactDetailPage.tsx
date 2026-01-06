import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Palette, Image, Plus, ImageOff } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useArtifactData, useColorize } from '@/hooks';
import { LoadingSpinner } from '@/components/ui';
import {
  ColorizationCard,
  ColorVariantGallery,
  VariantDetailView,
} from '@/components/colorization';
import type { ColorizationStatus } from '@/components/colorization';
import type { ColorVariant, ColorScheme, ArtifactImage } from '@/types';
import { deleteColorVariant } from '@/lib/db';

type Tab = 'colors' | 'photos';

export function PaletteArtifactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<Tab>('colors');

  // Load artifact data
  const { data, isLoading, error, refetch } = useArtifactData(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-stone-gray">{t('pages.artifact.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !data.artifact) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Palette className="h-16 w-16 text-stone-gray/30 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-2">
            {t('pages.artifact.notFound')}
          </h2>
          <p className="text-stone-gray mb-4">
            {error?.message || t('pages.artifact.couldNotLoad')}
          </p>
          <Link
            to="/palette/gallery"
            className="inline-flex items-center gap-2 rounded-lg bg-desert-teal px-4 py-2 text-bone-white hover:bg-oxidized-bronze transition-colors"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('pages.artifact.backToGallery')}
          </Link>
        </div>
      </div>
    );
  }

  const { artifact, images } = data;
  const artifactName = artifact.metadata?.name || t('pages.gallery.unnamedArtifact');

  return (
    <div className="min-h-screen pb-20">
      {/* Back Header */}
      <div className="sticky top-14 z-40 bg-parchment border-b border-desert-sand">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            to="/palette/gallery"
            className="rounded-full p-2 hover:bg-aged-paper transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-charcoal rtl:rotate-180" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-desert-teal to-oxidized-bronze">
              <Palette className="w-4 h-4 text-bone-white" />
            </div>
            <h2 className="font-heading font-semibold text-charcoal truncate">
              {artifactName}
            </h2>
          </div>
        </div>

        {/* Tab Navigation - Only Colors and Photos */}
        <div className="flex border-b border-desert-sand">
          <TabButton
            active={activeTab === 'colors'}
            onClick={() => setActiveTab('colors')}
            icon={Palette}
            label={t('pages.artifact.tabs.colors')}
            accentColor="desert-teal"
          />
          <TabButton
            active={activeTab === 'photos'}
            onClick={() => setActiveTab('photos')}
            icon={Image}
            label={t('pages.artifact.tabs.photos')}
            count={images.length}
            accentColor="desert-teal"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'colors' && (
          <ColorsTab
            artifactId={artifact.id}
            colorVariants={data.colorVariants}
            images={images}
            onRefetch={refetch}
          />
        )}
        {activeTab === 'photos' && <PhotosTab images={images} />}
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  accentColor?: 'terracotta' | 'desert-teal';
}

function TabButton({ active, onClick, icon: Icon, label, count, accentColor = 'terracotta' }: TabButtonProps) {
  const activeClass = accentColor === 'desert-teal'
    ? 'border-desert-teal text-desert-teal'
    : 'border-terracotta text-terracotta';
  const badgeClass = accentColor === 'desert-teal'
    ? 'bg-desert-teal'
    : 'bg-terracotta';

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors border-b-2',
        active
          ? activeClass
          : 'border-transparent text-stone-gray hover:text-charcoal'
      )}
    >
      <div className="relative">
        <Icon className="h-5 w-5" />
        {count !== undefined && count > 0 && (
          <span className={cn('absolute -top-1 -right-2 text-bone-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center', badgeClass)}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
      <span>{label}</span>
    </button>
  );
}

type ColorsTabMode = 'gallery' | 'generate' | 'detail';

interface ColorsTabProps {
  artifactId: string;
  colorVariants: ColorVariant[];
  images: ArtifactImage[];
  onRefetch: () => void;
}

function ColorsTab({ artifactId, colorVariants, images, onRefetch }: ColorsTabProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ColorsTabMode>(colorVariants.length > 0 ? 'gallery' : 'generate');
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme>('original');
  const [customPrompt, setCustomPrompt] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sourceImage = images.length > 0 ? images[0] : undefined;

  const {
    colorize,
    cancel,
    state: colorizeState,
    progress,
    error: colorizeError,
    isProcessing,
    reset,
  } = useColorize({
    artifactId,
    onSuccess: () => {
      onRefetch();
      setMode('gallery');
      reset();
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const colorizationStatus: ColorizationStatus = useMemo(() => {
    switch (colorizeState) {
      case 'uploading':
      case 'processing':
        return 'processing';
      case 'complete':
        return 'completed';
      case 'error':
        return 'error';
      default:
        return 'idle';
    }
  }, [colorizeState]);

  const handleGenerate = useCallback(async () => {
    if (!sourceImage) return;
    setErrorMessage(null);
    await colorize(
      sourceImage.blob,
      selectedScheme,
      selectedScheme === 'custom' ? customPrompt : undefined
    );
  }, [sourceImage, selectedScheme, customPrompt, colorize]);

  const handleVariantClick = useCallback((variant: ColorVariant) => {
    setSelectedVariant(variant);
    setMode('detail');
  }, []);

  const handleVariantDelete = useCallback(async (variantId: string) => {
    try {
      await deleteColorVariant(variantId);
      onRefetch();
      setSelectedVariant(null);
      setMode('gallery');
    } catch (err) {
      console.error('Failed to delete color variant:', err);
    }
  }, [onRefetch]);

  const handleDownload = useCallback(() => {
    if (!selectedVariant) return;

    const url = URL.createObjectURL(selectedVariant.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `colorized-${selectedVariant.colorScheme}-${artifactId.slice(0, 8)}.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }, [selectedVariant, artifactId]);

  const handleCloseDetail = useCallback(() => {
    setSelectedVariant(null);
    setMode('gallery');
  }, []);

  const handleRetry = useCallback(() => {
    reset();
    setErrorMessage(null);
    handleGenerate();
  }, [reset, handleGenerate]);

  const handleCancel = useCallback(() => {
    cancel();
    reset();
    setMode(colorVariants.length > 0 ? 'gallery' : 'generate');
  }, [cancel, reset, colorVariants.length]);

  const handleViewResult = useCallback(() => {
    onRefetch();
    setMode('gallery');
    reset();
  }, [onRefetch, reset]);

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-aged-paper mx-auto mb-4 flex items-center justify-center">
          <ImageOff className="h-8 w-8 text-stone-gray/50" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-charcoal mb-2">
          {t('pages.artifact.noImagesAvailable')}
        </h3>
        <p className="text-stone-gray text-sm max-w-xs mx-auto">
          {t('pages.artifact.captureFirst')}
        </p>
      </div>
    );
  }

  if (mode === 'detail' && selectedVariant && sourceImage) {
    return (
      <VariantDetailView
        variant={selectedVariant}
        originalImage={sourceImage}
        onClose={handleCloseDetail}
        onDownload={handleDownload}
        onDelete={() => handleVariantDelete(selectedVariant.id)}
      />
    );
  }

  if (mode === 'generate' || isProcessing) {
    return (
      <div className="space-y-4">
        {colorVariants.length > 0 && !isProcessing && (
          <button
            onClick={() => setMode('gallery')}
            className="flex items-center gap-2 text-sm text-stone-gray hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('pages.artifact.backToGallery')}
          </button>
        )}

        <ColorizationCard
          status={colorizationStatus}
          progress={progress}
          statusMessage={getColorizeStatusMessage(colorizeState, progress, t)}
          errorMessage={errorMessage || colorizeError?.message}
          selectedScheme={selectedScheme}
          onSchemeChange={setSelectedScheme}
          customPrompt={customPrompt}
          onCustomPromptChange={setCustomPrompt}
          onGenerate={handleGenerate}
          onCancel={handleCancel}
          onRetry={handleRetry}
          onViewResult={handleViewResult}
          hasModel={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-gray">
          {t('pages.artifact.variantsGenerated', { count: colorVariants.length })}
        </p>
        <button
          onClick={() => setMode('generate')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-desert-teal text-bone-white text-sm font-medium hover:bg-oxidized-bronze transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t('pages.artifact.generateMore')}
        </button>
      </div>

      <ColorVariantGallery
        variants={colorVariants}
        originalImage={sourceImage}
        onVariantClick={handleVariantClick}
        onVariantDelete={handleVariantDelete}
        emptyMessage={t('pages.artifact.generateColorVariants')}
      />
    </div>
  );
}

function getColorizeStatusMessage(state: string, progress: number, t: (key: string) => string): string {
  switch (state) {
    case 'uploading':
      if (progress < 15) return t('components.colorization.status.converting');
      if (progress < 30) return t('components.colorization.status.encoding');
      return t('components.colorization.status.uploading');
    case 'processing':
      if (progress < 50) return t('components.colorization.status.analyzing');
      if (progress < 70) return t('components.colorization.status.applying');
      if (progress < 85) return t('components.colorization.status.refining');
      if (progress < 95) return t('components.colorization.status.saving');
      return t('components.colorization.status.finalizing');
    case 'complete':
      return t('components.colorization.status.complete');
    case 'error':
      return t('components.colorization.status.error');
    default:
      return t('components.colorization.status.ready');
  }
}

interface PhotosTabProps {
  images: ReturnType<typeof useArtifactData>['data']['images'];
}

function PhotosTab({ images }: PhotosTabProps) {
  const { t } = useTranslation();

  if (images.length === 0) {
    return (
      <div className="text-center py-8">
        <Image className="h-12 w-12 text-stone-gray/50 mx-auto mb-3" />
        <p className="text-stone-gray">{t('pages.artifact.noPhotos')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-gray">
        {t('pages.artifact.photosCaptured', { count: images.length })}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-xl overflow-hidden border border-desert-sand bg-aged-paper"
          >
            <img
              src={URL.createObjectURL(image.blob)}
              alt={`Artifact ${image.angle}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-charcoal/70 text-bone-white text-xs capitalize">
              {image.angle}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
