import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const { t } = useTranslation();
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-terracotta border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={t('common.labels.loading')}
    >
      <span className="sr-only">{t('common.labels.loading')}</span>
    </div>
  );
}

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-parchment">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-stone-gray">{message || t('ui.loadingScreen.loading')}</p>
    </div>
  );
}
