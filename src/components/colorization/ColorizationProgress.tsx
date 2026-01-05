import { X, Loader2, CheckCircle2, AlertCircle, Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export type ColorizationStatus =
  | 'idle'
  | 'processing'
  | 'completed'
  | 'error';

export interface ColorizationProgressProps {
  status: ColorizationStatus;
  progress: number;
  statusMessage?: string;
  errorMessage?: string;
  onCancel?: () => void;
  className?: string;
}

const statusConfig: Record<ColorizationStatus, {
  icon: typeof Loader2;
  labelKey: string;
  color: string;
}> = {
  idle: {
    icon: Palette,
    labelKey: 'components.colorization.progressLabels.idle',
    color: 'text-stone-gray',
  },
  processing: {
    icon: Loader2,
    labelKey: 'components.colorization.progressLabels.processing',
    color: 'text-terracotta',
  },
  completed: {
    icon: CheckCircle2,
    labelKey: 'components.colorization.progressLabels.completed',
    color: 'text-oxidized-bronze',
  },
  error: {
    icon: AlertCircle,
    labelKey: 'components.colorization.progressLabels.error',
    color: 'text-rust-red',
  },
};

export function ColorizationProgress({
  status,
  progress,
  statusMessage,
  errorMessage,
  onCancel,
  className,
}: ColorizationProgressProps) {
  const { t } = useTranslation();
  const config = statusConfig[status];
  const Icon = config.icon;
  const isAnimated = status === 'processing';
  const canCancel = status === 'processing';

  // Ensure progress is clamped between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      {/* Status header with icon and cancel button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon
            className={cn(
              'w-5 h-5',
              config.color,
              isAnimated && 'animate-spin'
            )}
          />
          <span className={cn('font-medium text-sm', config.color)}>
            {t(config.labelKey)}
          </span>
        </div>

        {canCancel && onCancel && (
          <button
            onClick={onCancel}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-stone-gray hover:text-rust-red hover:bg-rust-red/10 rounded-lg transition-colors"
            aria-label={t('components.colorization.cancelColorization')}
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{t('components.colorization.cancel')}</span>
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-desert-sand/40 rounded-full overflow-hidden">
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out',
            status === 'completed' && 'bg-oxidized-bronze',
            status === 'error' && 'bg-rust-red',
            status === 'processing' && 'bg-terracotta',
            status === 'idle' && 'bg-stone-gray'
          )}
          style={{ width: `${clampedProgress}%` }}
        />

        {/* Animated shimmer for active states */}
        {isAnimated && (
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
            style={{ width: `${clampedProgress}%` }}
          />
        )}
      </div>

      {/* Progress percentage */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-stone-gray text-sm">
          {statusMessage || getDefaultMessage(status, clampedProgress, t)}
        </p>
        <span className="text-charcoal font-medium text-sm tabular-nums">
          {clampedProgress}%
        </span>
      </div>

      {/* Error message */}
      {status === 'error' && errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-rust-red/10 border border-rust-red/30">
          <div className="flex gap-2 text-sm text-rust-red">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Success message */}
      {status === 'completed' && (
        <div className="mt-3 p-3 rounded-xl bg-oxidized-bronze/10 border border-oxidized-bronze/30">
          <div className="flex gap-2 text-sm text-oxidized-bronze">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{t('components.colorization.successMessage')}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function getDefaultMessage(
  status: ColorizationStatus,
  progress: number,
  t: (key: string) => string
): string {
  switch (status) {
    case 'idle':
      return t('components.colorization.progressMessages.selectScheme');
    case 'processing':
      if (progress < 30) {
        return t('components.colorization.progressMessages.analyzingSurfaces');
      } else if (progress < 60) {
        return t('components.colorization.progressMessages.applyingScheme');
      } else if (progress < 90) {
        return t('components.colorization.progressMessages.refiningDetails');
      } else {
        return t('components.colorization.progressMessages.finalizingColorization');
      }
    case 'completed':
      return t('components.colorization.progressMessages.colorizationFinished');
    case 'error':
      return t('components.colorization.progressMessages.errorOccurred');
    default:
      return '';
  }
}
