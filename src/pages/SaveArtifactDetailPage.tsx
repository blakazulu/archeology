import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Box, Image, FileText, Download, Share2 } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useArtifactData, useReconstruct3D } from '@/hooks';
import { ReconstructionCard } from '@/components/reconstruction';
import { ModelViewer } from '@/components/viewer';
import { LoadingSpinner } from '@/components/ui';
import {
  InfoCardDisplay,
  InfoCardEditor,
  InfoCardExport,
  InfoCardGeneration,
} from '@/components/info-card';
import type { ReconstructionMethod } from '@/components/reconstruction';
import type { ReconstructionStatus } from '@/components/reconstruction/ReconstructionProgress';
import type { InfoCard } from '@/types';

type Tab = '3d' | 'photos' | 'info';

export function SaveArtifactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<Tab>('3d');

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
          <Box className="h-16 w-16 text-stone-gray/30 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-2">
            {t('pages.artifact.notFound')}
          </h2>
          <p className="text-stone-gray mb-4">
            {error?.message || t('pages.artifact.couldNotLoad')}
          </p>
          <Link
            to="/save/gallery"
            className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-4 py-2 text-bone-white hover:bg-clay transition-colors"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('pages.artifact.backToGallery')}
          </Link>
        </div>
      </div>
    );
  }

  const { artifact, images, model } = data;
  const artifactName = artifact.metadata?.name || t('pages.gallery.unnamedArtifact');

  return (
    <div className="min-h-screen pb-20">
      {/* Back Header */}
      <div className="sticky top-14 z-40 bg-parchment border-b border-desert-sand">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            to="/save/gallery"
            className="rounded-full p-2 hover:bg-aged-paper transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-charcoal rtl:rotate-180" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-terracotta to-clay">
              <Box className="w-4 h-4 text-bone-white" />
            </div>
            <h2 className="font-heading font-semibold text-charcoal truncate">
              {artifactName}
            </h2>
          </div>
        </div>

        {/* Tab Navigation - Only 3D, Photos, Info */}
        <div className="flex border-b border-desert-sand">
          <TabButton
            active={activeTab === '3d'}
            onClick={() => setActiveTab('3d')}
            icon={Box}
            label={t('pages.artifact.tabs.model')}
          />
          <TabButton
            active={activeTab === 'photos'}
            onClick={() => setActiveTab('photos')}
            icon={Image}
            label={t('pages.artifact.tabs.photos')}
            count={images.length}
          />
          <TabButton
            active={activeTab === 'info'}
            onClick={() => setActiveTab('info')}
            icon={FileText}
            label={t('pages.artifact.tabs.info')}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === '3d' && (
          <Model3DTab
            artifactId={artifact.id}
            model={model}
            images={images}
            artifactStatus={artifact.status}
            onReconstructionComplete={refetch}
          />
        )}
        {activeTab === 'photos' && <PhotosTab images={images} />}
        {activeTab === 'info' && (
          <InfoTab
            artifactId={artifact.id}
            artifact={artifact}
            images={images}
            infoCard={data.infoCard}
            onRefetch={refetch}
          />
        )}
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
}

function TabButton({ active, onClick, icon: Icon, label, count }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors border-b-2',
        active
          ? 'border-terracotta text-terracotta'
          : 'border-transparent text-stone-gray hover:text-charcoal'
      )}
    >
      <div className="relative">
        <Icon className="h-5 w-5" />
        {count !== undefined && count > 0 && (
          <span className="absolute -top-1 -right-2 bg-terracotta text-bone-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
      <span>{label}</span>
    </button>
  );
}

interface Model3DTabProps {
  artifactId: string;
  model: ReturnType<typeof useArtifactData>['data']['model'];
  images: ReturnType<typeof useArtifactData>['data']['images'];
  artifactStatus: string;
  onReconstructionComplete: () => void;
}

function Model3DTab({
  artifactId,
  model,
  images,
  artifactStatus,
  onReconstructionComplete,
}: Model3DTabProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<ReconstructionMethod>('multi');

  const getReconstructionStatus = (): ReconstructionStatus => {
    if (model) return 'completed';
    if (artifactStatus === 'processing-3d') return 'processing';
    if (artifactStatus === 'error') return 'error';
    return 'idle';
  };

  const {
    startReconstruction,
    cancel,
    state,
    progress,
    error,
    reset,
  } = useReconstruct3D({
    artifactId,
    onSuccess: () => {
      onReconstructionComplete();
    },
    onError: (err) => {
      console.error('Reconstruction failed:', err);
    },
  });

  const uiStatus: ReconstructionStatus = useMemo(() => {
    if (model) return 'completed';
    if (state === 'uploading') return 'uploading';
    if (state === 'processing') return 'processing';
    if (state === 'error') return 'error';
    if (state === 'complete') return 'completed';
    return getReconstructionStatus();
  }, [model, state, artifactStatus]);

  const handleStart = useCallback(async () => {
    if (images.length === 0) return;
    const imageBlobs = images.map((img) => img.blob);
    await startReconstruction(imageBlobs, selectedMethod === 'single' ? 'single' : 'multi');
  }, [images, selectedMethod, startReconstruction]);

  const handleViewResult = useCallback(() => {
    // Model is already visible
  }, []);

  const modelUrl = useMemo(() => {
    if (!model?.blob) return null;
    return URL.createObjectURL(model.blob);
  }, [model?.blob]);

  if (model && modelUrl) {
    return (
      <div className="space-y-4">
        <div className="aspect-square rounded-xl overflow-hidden border border-desert-sand">
          <ModelViewer
            modelUrl={modelUrl}
            initialLighting="museum"
            onError={(err) => console.error('Model viewer error:', err)}
          />
        </div>

        <div className="rounded-xl bg-aged-paper p-4 space-y-3">
          <h3 className="font-heading font-semibold text-charcoal">{t('components.modelViewer.modelDetails')}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-stone-gray">{t('components.modelViewer.format')}</p>
              <p className="text-charcoal font-medium uppercase">{model.format}</p>
            </div>
            <div>
              <p className="text-stone-gray">{t('components.modelViewer.source')}</p>
              <p className="text-charcoal font-medium">
                {model.source === '3d-single' ? t('components.modelViewer.singleImage') : t('components.modelViewer.multiImage')}
              </p>
            </div>
            <div>
              <p className="text-stone-gray">{t('components.modelViewer.created')}</p>
              <p className="text-charcoal font-medium">
                {new Date(model.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-stone-gray">{t('components.modelViewer.size')}</p>
              <p className="text-charcoal font-medium">
                {model.metadata?.fileSize
                  ? `${(model.metadata.fileSize / 1024 / 1024).toFixed(2)} MB`
                  : t('components.modelViewer.unknown')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = modelUrl;
              link.download = `artifact-${artifactId}.${model.format}`;
              link.click();
            }}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-terracotta py-3 text-bone-white font-medium hover:bg-clay transition-colors"
          >
            <Download className="h-5 w-5" />
            {t('components.modelViewer.download3DModel')}
          </button>
        </div>

        <div className="rounded-xl border border-desert-sand p-4">
          <p className="text-sm text-stone-gray mb-3">
            {t('components.modelViewer.notSatisfied')}
          </p>
          <button
            onClick={() => reset()}
            className="text-sm text-terracotta hover:text-clay font-medium"
          >
            {t('components.modelViewer.generateNew')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <ReconstructionCard
      status={uiStatus}
      progress={progress}
      statusMessage={getStatusMessage(state, progress, t)}
      errorMessage={error?.message}
      selectedMethod={selectedMethod}
      onMethodChange={setSelectedMethod}
      onStart={handleStart}
      onCancel={cancel}
      onRetry={() => {
        reset();
        handleStart();
      }}
      onViewResult={handleViewResult}
      imageCount={images.length}
    />
  );
}

function getStatusMessage(state: string, progress: number, t: (key: string) => string): string {
  switch (state) {
    case 'uploading':
      if (progress < 15) return t('components.reconstruction.status.converting');
      if (progress < 30) return t('components.reconstruction.status.encoding');
      return t('components.reconstruction.status.uploading');
    case 'processing':
      if (progress < 50) return t('components.reconstruction.status.starting');
      if (progress < 70) return t('components.reconstruction.status.analyzing');
      if (progress < 85) return t('components.reconstruction.status.building');
      if (progress < 95) return t('components.reconstruction.status.saving');
      return t('components.reconstruction.status.finalizing');
    case 'complete':
      return t('components.reconstruction.status.complete');
    case 'error':
      return t('components.reconstruction.status.error');
    default:
      return t('components.reconstruction.status.ready');
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

interface InfoTabProps {
  artifactId: string;
  artifact: ReturnType<typeof useArtifactData>['data']['artifact'];
  images: ReturnType<typeof useArtifactData>['data']['images'];
  infoCard: ReturnType<typeof useArtifactData>['data']['infoCard'];
  onRefetch: () => void;
}

function InfoTab({ artifactId, artifact, images, infoCard, onRefetch }: InfoTabProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'view' | 'edit' | 'generate'>('view');
  const [showExport, setShowExport] = useState(false);
  const [currentInfoCard, setCurrentInfoCard] = useState<InfoCard | null>(infoCard);

  useMemo(() => {
    if (infoCard) {
      setCurrentInfoCard(infoCard);
    }
  }, [infoCard]);

  const handleGenerationComplete = useCallback((newInfoCard: InfoCard) => {
    setCurrentInfoCard(newInfoCard);
    setMode('view');
    onRefetch();
  }, [onRefetch]);

  const handleEditSave = useCallback((updatedCard: InfoCard) => {
    setCurrentInfoCard(updatedCard);
    setMode('view');
    onRefetch();
  }, [onRefetch]);

  if (!currentInfoCard || mode === 'generate') {
    return (
      <InfoCardGeneration
        artifactId={artifactId}
        images={images}
        initialMetadata={artifact?.metadata}
        onComplete={handleGenerationComplete}
        onCancel={currentInfoCard ? () => setMode('view') : undefined}
      />
    );
  }

  if (mode === 'edit') {
    return (
      <InfoCardEditor
        infoCard={currentInfoCard}
        onSave={handleEditSave}
        onCancel={() => setMode('view')}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end rtl:flex-row-reverse">
        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-aged-paper border border-desert-sand text-sm text-charcoal hover:bg-desert-sand/50 transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" />
          {t('pages.artifact.export')}
        </button>
        <button
          onClick={() => setMode('generate')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-aged-paper border border-desert-sand text-sm text-charcoal hover:bg-desert-sand/50 transition-colors"
        >
          {t('pages.artifact.regenerate')}
        </button>
      </div>

      <InfoCardDisplay
        infoCard={currentInfoCard}
        onEdit={() => setMode('edit')}
        showEditButton
      />

      {showExport && artifact && (
        <InfoCardExport
          infoCard={currentInfoCard}
          artifact={artifact}
          images={images}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
