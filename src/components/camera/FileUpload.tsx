import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onCancel: () => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

interface ValidationError {
  file: string;
  error: string;
}

export function FileUpload({
  onFilesSelected,
  onCancel,
  maxFiles = 10,
  maxSizeMB = 20,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  className,
}: FileUploadProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(new Map());
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check type
    if (!acceptedTypes.includes(file.type)) {
      return t('components.fileUpload.invalidType');
    }

    // Check size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return t('components.fileUpload.fileTooLarge', { size: sizeMB.toFixed(1), max: maxSizeMB });
    }

    return null;
  }, [acceptedTypes, maxSizeMB, t]);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newErrors: ValidationError[] = [];
    const validFiles: File[] = [];

    // Check if adding these would exceed max
    const remainingSlots = maxFiles - selectedFiles.length;
    if (fileArray.length > remainingSlots) {
      newErrors.push({
        file: 'Multiple files',
        error: t('components.fileUpload.maxFilesReached', { count: remainingSlots, max: maxFiles }),
      });
    }

    const filesToProcess = fileArray.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      const error = validateFile(file);
      if (error) {
        newErrors.push({ file: file.name, error });
      } else {
        validFiles.push(file);

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrls((prev) => new Map(prev).set(file.name + file.size, url));
      }
    }

    setErrors(newErrors);
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  }, [maxFiles, selectedFiles.length, validateFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => {
      const file = prev[index];
      const key = file.name + file.size;
      const url = previewUrls.get(key);
      if (url) {
        URL.revokeObjectURL(url);
        setPreviewUrls((p) => {
          const newMap = new Map(p);
          newMap.delete(key);
          return newMap;
        });
      }
      return prev.filter((_, i) => i !== index);
    });
  }, [previewUrls]);

  const handleContinue = useCallback(() => {
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles);
    }
  }, [selectedFiles, onFilesSelected]);

  const handleClickUpload = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className={cn('fixed inset-0 z-[100] bg-parchment', className)}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-desert-sand safe-area-top">
          <div className="flex items-center justify-between">
            <button
              onClick={onCancel}
              className="text-stone-gray hover:text-charcoal"
            >
              {t('components.fileUpload.cancel')}
            </button>
            <h2 className="font-heading text-lg font-semibold text-charcoal">
              {t('components.fileUpload.uploadPhotos')}
            </h2>
            <button
              onClick={handleContinue}
              disabled={selectedFiles.length === 0}
              className="text-terracotta font-medium disabled:opacity-50"
            >
              {t('components.fileUpload.continue')}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickUpload}
            className={cn(
              'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
              isDragging
                ? 'border-terracotta bg-terracotta/5'
                : 'border-desert-sand bg-aged-paper hover:border-clay'
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-full bg-sienna/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-sienna" />
            </div>
            <p className="font-medium text-charcoal mb-1">
              {t('components.fileUpload.dragAndDrop')}
            </p>
            <p className="text-stone-gray text-sm">
              {t('components.fileUpload.orTapToBrowse')}
            </p>
            <p className="text-stone-gray/60 text-xs mt-4">
              {t('components.fileUpload.acceptedFormats', { maxSize: maxSizeMB })}
            </p>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-rust-red/10 border border-rust-red/30">
              {errors.map((error, idx) => (
                <div key={idx} className="flex gap-2 text-sm text-rust-red">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>{error.file}:</strong> {error.error}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Selected files preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-charcoal mb-3">
                {t('components.fileUpload.selectedPhotos', { count: selectedFiles.length, max: maxFiles })}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {selectedFiles.map((file, idx) => {
                  const key = file.name + file.size;
                  const url = previewUrls.get(key);

                  return (
                    <div
                      key={key}
                      className="relative aspect-square rounded-xl overflow-hidden bg-aged-paper border border-desert-sand"
                    >
                      {url ? (
                        <img
                          src={url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-stone-gray" />
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-rust-red transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-bone-white text-xs truncate">
                          {file.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-desert-sand safe-area-bottom">
          <button
            onClick={handleContinue}
            disabled={selectedFiles.length === 0}
            className="w-full py-4 bg-terracotta text-bone-white rounded-xl font-medium disabled:opacity-50 hover:bg-clay transition-colors"
          >
            {selectedFiles.length === 0
              ? t('components.fileUpload.continue')
              : t('components.fileUpload.continue')}
          </button>
        </div>
      </div>
    </div>
  );
}
