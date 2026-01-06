import { useState, useEffect } from 'react';
import { X, Download, Trash2, Palette, Calendar, Cpu, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import type { ColorVariant, ArtifactImage, ColorScheme } from '@/types/artifact';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { LoadingSpinner } from '@/components/ui';

interface VariantDetailViewProps {
  variant: ColorVariant;
  originalImage: ArtifactImage;
  onClose: () => void;
  onDownload: () => void;
  onDelete?: () => void;
}

/**
 * Get color scheme key for translations
 */
function getColorSchemeKey(scheme: ColorScheme): string {
  switch (scheme) {
    case 'roman':
      return 'roman';
    case 'greek':
      return 'greek';
    case 'egyptian':
      return 'egyptian';
    case 'mesopotamian':
      return 'mesopotamian';
    case 'weathered':
      return 'weathered';
    case 'original':
      return 'original';
    case 'custom':
      return 'custom';
    default:
      return 'unknown';
  }
}

/**
 * Full-screen modal view for color variant detail
 * Shows before/after comparison, metadata, and action buttons
 */
export function VariantDetailView({
  variant,
  originalImage,
  onClose,
  onDownload,
  onDelete,
}: VariantDetailViewProps) {
  const { t } = useTranslation();
  const [variantUrl, setVariantUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create object URLs for images
  useEffect(() => {
    if (variant.blob) {
      const url = URL.createObjectURL(variant.blob);
      setVariantUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    return undefined;
  }, [variant.blob]);

  useEffect(() => {
    if (originalImage.blob) {
      const url = URL.createObjectURL(originalImage.blob);
      setOriginalUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    return undefined;
  }, [originalImage.blob]);

  const schemeKey = getColorSchemeKey(variant.colorScheme);
  const schemeLabel = t(`components.colorization.schemes.${schemeKey}`);
  const schemeDesc = t(`components.colorization.schemes.${schemeKey}Desc`);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    onDelete?.();
    // Note: Parent component should handle closing the modal after delete
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDeleteConfirm, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/90 backdrop-blur-sm"
        onClick={!showDeleteConfirm ? onClose : undefined}
      />

      {/* Modal content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] m-4 rounded-xl bg-aged-paper border border-desert-sand shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-desert-sand">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-terracotta/20 flex items-center justify-center">
              <Palette className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-charcoal">
                {schemeLabel} {t('components.colorization.variant.colorVariant')}
              </h2>
              <p className="text-sm text-stone-gray">{schemeDesc}</p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-desert-sand/50 transition-colors"
            aria-label={t('common.buttons.close')}
          >
            <X className="h-6 w-6 text-stone-gray" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Before/After Slider */}
          {variantUrl && originalUrl && (
            <BeforeAfterSlider
              beforeImage={originalUrl}
              afterImage={variantUrl}
              beforeLabel={t('components.colorization.variant.before')}
              afterLabel={schemeLabel}
              className="max-w-2xl mx-auto"
            />
          )}

          {/* Metadata */}
          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Color scheme */}
            <div className="p-4 rounded-lg bg-bone-white border border-desert-sand">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4 text-terracotta" />
                <span className="text-sm font-medium text-stone-gray">{t('components.colorization.colorScheme')}</span>
              </div>
              <p className="text-charcoal font-medium">{schemeLabel}</p>
            </div>

            {/* AI Model */}
            <div className="p-4 rounded-lg bg-bone-white border border-desert-sand">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-terracotta" />
                <span className="text-sm font-medium text-stone-gray">{t('components.modelViewer.aiModel')}</span>
              </div>
              <p className="text-charcoal font-medium truncate">
                {variant.aiModel || t('components.colorization.schemes.unknown')}
              </p>
            </div>

            {/* Created date */}
            <div className="p-4 rounded-lg bg-bone-white border border-desert-sand">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-terracotta" />
                <span className="text-sm font-medium text-stone-gray">{t('components.modelViewer.created')}</span>
              </div>
              <p className="text-charcoal font-medium">
                {formatDate(variant.createdAt)}
              </p>
            </div>
          </div>

          {/* Prompt (if custom) */}
          {variant.prompt && (
            <div className="max-w-2xl mx-auto p-4 rounded-lg bg-bone-white border border-desert-sand">
              <p className="text-sm font-medium text-stone-gray mb-2">{t('components.colorization.customColorDescription')}</p>
              <p className="text-charcoal">{variant.prompt}</p>
            </div>
          )}

          {/* Speculative disclaimer */}
          <div className="max-w-2xl mx-auto p-4 rounded-lg bg-gold-ochre/10 border border-gold-ochre/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-gold-ochre flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-charcoal mb-1">
                  {t('components.colorization.speculativeReconstruction')}
                </p>
                <p className="text-sm text-stone-gray">
                  {t('components.colorization.speculativeDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-desert-sand bg-bone-white">
          <div className="flex gap-3 justify-end">
            {/* Delete button */}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className={cn(
                  'px-4 py-2.5 rounded-lg',
                  'border border-rust-red text-rust-red',
                  'hover:bg-rust-red hover:text-bone-white',
                  'transition-colors flex items-center gap-2'
                )}
              >
                <Trash2 className="w-4 h-4" />
                {t('common.buttons.delete')}
              </button>
            )}

            {/* Download button */}
            <button
              onClick={onDownload}
              className={cn(
                'px-4 py-2.5 rounded-lg',
                'bg-terracotta text-bone-white',
                'hover:bg-terracotta/90',
                'transition-colors flex items-center gap-2'
              )}
            >
              <Download className="w-4 h-4" />
              {t('components.colorization.export.download')}
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-charcoal/50"
            onClick={!isDeleting ? handleCancelDelete : undefined}
          />
          <div className="relative w-full max-w-md rounded-xl bg-aged-paper border border-desert-sand shadow-xl p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-rust-red/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-rust-red" />
              </div>
            </div>

            {/* Content */}
            <h3 className="font-heading text-xl font-semibold text-charcoal text-center mb-2">
              {t('components.colorization.variant.deleteVariantTitle')}
            </h3>

            <p className="text-stone-gray text-center mb-2">
              {t('components.colorization.variant.deleteConfirmMessage')}{' '}
              <span className="font-medium text-charcoal">{schemeLabel}</span> {t('components.colorization.variant.colorVariant').toLowerCase()}?
            </p>

            <p className="text-sm text-rust-red text-center mb-6">
              {t('components.colorization.variant.deleteWarning')}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-lg border border-desert-sand bg-bone-white text-charcoal font-medium hover:bg-aged-paper transition-colors disabled:opacity-50"
              >
                {t('common.buttons.cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-lg bg-rust-red text-bone-white font-medium hover:bg-rust-red/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    {t('components.colorization.variant.deleting')}
                  </>
                ) : (
                  t('common.buttons.delete')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
