import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Search, Plus, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';

export function GalleryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Replace with actual data from Dexie
  const artifacts: unknown[] = [];

  return (
    <div className="px-4 py-6">
      {/* Search and View Toggle */}
      <div className="flex gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-gray" />
          <input
            type="text"
            placeholder="Search artifacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-desert-sand bg-aged-paper py-2 pl-10 pr-4 text-sm text-charcoal placeholder:text-stone-gray focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>

        {/* View Toggle */}
        <div className="flex rounded-lg border border-desert-sand bg-aged-paper p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'rounded p-2 transition-colors',
              viewMode === 'grid'
                ? 'bg-terracotta text-bone-white'
                : 'text-stone-gray hover:text-charcoal'
            )}
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'rounded p-2 transition-colors',
              viewMode === 'list'
                ? 'bg-terracotta text-bone-white'
                : 'text-stone-gray hover:text-charcoal'
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Gallery Content */}
      {artifacts.length === 0 ? (
        <EmptyGallery />
      ) : viewMode === 'grid' ? (
        <GridView artifacts={artifacts} />
      ) : (
        <ListView artifacts={artifacts} />
      )}

      {/* Floating Action Button */}
      <Link
        to="/capture"
        className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-bone-white shadow-lg transition-all hover:bg-clay active:scale-95"
        aria-label="Capture new artifact"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}

function EmptyGallery() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-aged-paper p-6 mb-4">
        <FolderOpen className="h-12 w-12 text-stone-gray/50" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-charcoal mb-2">
        No artifacts yet
      </h3>
      <p className="text-sm text-stone-gray text-center mb-6">
        Start by capturing or uploading your first artifact
      </p>
      <Link
        to="/capture"
        className="rounded-lg bg-terracotta px-6 py-2.5 font-medium text-bone-white transition-colors hover:bg-clay"
      >
        Capture First Artifact
      </Link>
    </div>
  );
}

interface ViewProps {
  artifacts: unknown[];
}

function GridView({ artifacts }: ViewProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Grid items will go here */}
      <p className="col-span-2 text-center text-stone-gray">
        Grid view placeholder
      </p>
    </div>
  );
}

function ListView({ artifacts }: ViewProps) {
  return (
    <div className="space-y-3">
      {/* List items will go here */}
      <p className="text-center text-stone-gray">List view placeholder</p>
    </div>
  );
}
