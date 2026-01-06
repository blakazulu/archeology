import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Box, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db } from '@/lib/db';
import { useGalleryFilters } from '@/hooks';
import { GalleryGrid, GalleryList, GalleryToolbar } from '@/components/gallery';

type ViewMode = 'grid' | 'list';

export function SaveGalleryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { t } = useTranslation();

  // Load artifacts from IndexedDB with live query
  const allArtifacts = useLiveQuery(
    () => db.artifacts.orderBy('createdAt').reverse().toArray(),
    []
  );

  // Filter to only show "save" mode artifacts (or legacy artifacts without captureMode)
  const artifacts = useMemo(() => {
    if (!allArtifacts) return [];
    return allArtifacts.filter(
      (a) => a.metadata?.captureMode === 'save' || !a.metadata?.captureMode
    );
  }, [allArtifacts]);

  // Use the gallery filters hook
  const {
    filters,
    setSearch,
    setStatus,
    setSortBy,
    toggleSortOrder,
    filteredArtifacts,
    resultCount,
  } = useGalleryFilters(artifacts);

  const isLoading = allArtifacts === undefined;

  return (
    <div className="px-4 py-6 pb-24 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/save"
            className="rounded-full p-2 hover:bg-aged-paper transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-charcoal rtl:rotate-180" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta to-clay">
              <Box className="w-5 h-5 text-bone-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-sienna">
                {t('pages.save.galleryTitle')}
              </h1>
              <p className="text-sm text-stone-gray">
                {t('pages.save.gallerySubtitle')}
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/save"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-terracotta text-bone-white text-sm font-medium hover:bg-clay transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t('pages.save.newCapture')}
        </Link>
      </div>

      {/* Toolbar with filters and view toggle */}
      <GalleryToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        setSearch={setSearch}
        setStatus={setStatus}
        setSortBy={setSortBy}
        toggleSortOrder={toggleSortOrder}
        resultCount={resultCount}
      />

      {/* Gallery Content */}
      <div className="mt-6">
        {viewMode === 'grid' ? (
          <GalleryGrid
            artifacts={filteredArtifacts}
            isLoading={isLoading}
            basePath="/save"
          />
        ) : (
          <GalleryList
            artifacts={filteredArtifacts}
            isLoading={isLoading}
            basePath="/save"
          />
        )}
      </div>
    </div>
  );
}
