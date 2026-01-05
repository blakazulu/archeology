import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { ColorScheme } from '@/types/artifact';

export interface ColorSchemeSelectorProps {
  value: ColorScheme;
  onChange: (scheme: ColorScheme) => void;
  customPrompt?: string;
  onCustomPromptChange?: (prompt: string) => void;
  disabled?: boolean;
  className?: string;
}

interface SchemePreset {
  id: ColorScheme;
  nameKey: string;
  icon: string;
  gradient: string;
  descriptionKey: string;
}

const PRESETS: SchemePreset[] = [
  {
    id: 'roman',
    nameKey: 'components.colorization.schemes.roman',
    icon: '\u{1F3DB}\uFE0F',
    gradient: 'from-red-700 to-yellow-500',
    descriptionKey: 'components.colorization.schemes.romanDesc',
  },
  {
    id: 'greek',
    nameKey: 'components.colorization.schemes.greek',
    icon: '\u26B1\uFE0F',
    gradient: 'from-orange-600 to-blue-400',
    descriptionKey: 'components.colorization.schemes.greekDesc',
  },
  {
    id: 'egyptian',
    nameKey: 'components.colorization.schemes.egyptian',
    icon: '\u{1F53A}',
    gradient: 'from-blue-600 to-yellow-400',
    descriptionKey: 'components.colorization.schemes.egyptianDesc',
  },
  {
    id: 'mesopotamian',
    nameKey: 'components.colorization.schemes.mesopotamian',
    icon: '\u{1F981}',
    gradient: 'from-blue-800 to-amber-500',
    descriptionKey: 'components.colorization.schemes.mesopotamianDesc',
  },
  {
    id: 'weathered',
    nameKey: 'components.colorization.schemes.weathered',
    icon: '\u23F3',
    gradient: 'from-stone-500 to-amber-700',
    descriptionKey: 'components.colorization.schemes.weatheredDesc',
  },
  {
    id: 'original',
    nameKey: 'components.colorization.schemes.original',
    icon: '\u2728',
    gradient: 'from-emerald-500 to-rose-500',
    descriptionKey: 'components.colorization.schemes.originalDesc',
  },
  {
    id: 'custom',
    nameKey: 'components.colorization.schemes.custom',
    icon: '\u{1F3A8}',
    gradient: 'from-terracotta to-gold-ochre',
    descriptionKey: 'components.colorization.schemes.customDesc',
  },
];

export function ColorSchemeSelector({
  value,
  onChange,
  customPrompt = '',
  onCustomPromptChange,
  disabled = false,
  className,
}: ColorSchemeSelectorProps) {
  const { t } = useTranslation();
  const [hoveredScheme, setHoveredScheme] = useState<ColorScheme | null>(null);

  return (
    <div className={cn('w-full', className)}>
      <label className="block font-heading text-sm font-semibold text-charcoal mb-3">
        {t('components.colorization.colorScheme')}
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {PRESETS.map((preset) => {
          const isSelected = value === preset.id;
          const isHovered = hoveredScheme === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => !disabled && onChange(preset.id)}
              onMouseEnter={() => setHoveredScheme(preset.id)}
              onMouseLeave={() => setHoveredScheme(null)}
              disabled={disabled}
              className={cn(
                'relative p-3 rounded-xl border-2 text-left transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2',
                isSelected
                  ? 'border-terracotta bg-terracotta/5'
                  : 'border-desert-sand bg-aged-paper hover:border-clay hover:bg-desert-sand/20',
                disabled && 'opacity-50 cursor-not-allowed',
                !disabled && !isSelected && 'cursor-pointer'
              )}
              aria-pressed={isSelected}
            >
              {/* Color preview gradient */}
              <div
                className={cn(
                  'w-full h-3 rounded-full mb-3 bg-gradient-to-r',
                  preset.gradient
                )}
              />

              {/* Icon and name */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg" role="img" aria-label={t(preset.nameKey)}>
                  {preset.icon}
                </span>
                <h3
                  className={cn(
                    'font-heading font-semibold text-sm transition-colors',
                    isSelected || isHovered ? 'text-terracotta' : 'text-charcoal'
                  )}
                >
                  {t(preset.nameKey)}
                </h3>
              </div>

              {/* Description */}
              <p className="text-stone-gray text-xs leading-tight">
                {t(preset.descriptionKey)}
              </p>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-terracotta" />
              )}
            </button>
          );
        })}
      </div>

      {/* Custom prompt input */}
      {value === 'custom' && (
        <div className="mt-4">
          <label
            htmlFor="custom-prompt"
            className="block text-sm font-medium text-charcoal mb-2"
          >
            {t('components.colorization.customColorDescription')}
          </label>
          <textarea
            id="custom-prompt"
            value={customPrompt}
            onChange={(e) => onCustomPromptChange?.(e.target.value)}
            disabled={disabled}
            placeholder={t('components.colorization.customPlaceholder')}
            className={cn(
              'w-full px-4 py-3 rounded-xl border-2 border-desert-sand bg-bone-white',
              'text-charcoal placeholder:text-stone-gray/60',
              'focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20',
              'resize-none transition-colors',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            rows={3}
          />
          <p className="mt-2 text-xs text-stone-gray">
            {t('components.colorization.customHelp')}
          </p>
        </div>
      )}
    </div>
  );
}
