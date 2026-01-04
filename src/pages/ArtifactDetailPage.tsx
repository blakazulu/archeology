import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Box, Image, FileText, Palette } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type Tab = '3d' | 'photos' | 'info' | 'colors';

export function ArtifactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('3d');

  // TODO: Load artifact from database using id

  return (
    <div className="min-h-screen pb-20">
      {/* Back Header */}
      <div className="sticky top-14 z-40 bg-parchment border-b border-desert-sand">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            to="/gallery"
            className="rounded-full p-2 hover:bg-aged-paper transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-charcoal" />
          </Link>
          <h2 className="font-heading font-semibold text-charcoal truncate">
            Artifact #{id?.slice(0, 8)}
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-desert-sand">
          <TabButton
            active={activeTab === '3d'}
            onClick={() => setActiveTab('3d')}
            icon={Box}
            label="3D Model"
          />
          <TabButton
            active={activeTab === 'photos'}
            onClick={() => setActiveTab('photos')}
            icon={Image}
            label="Photos"
          />
          <TabButton
            active={activeTab === 'info'}
            onClick={() => setActiveTab('info')}
            icon={FileText}
            label="Info"
          />
          <TabButton
            active={activeTab === 'colors'}
            onClick={() => setActiveTab('colors')}
            icon={Palette}
            label="Colors"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === '3d' && <Model3DTab />}
        {activeTab === 'photos' && <PhotosTab />}
        {activeTab === 'info' && <InfoTab />}
        {activeTab === 'colors' && <ColorsTab />}
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
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
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}

function Model3DTab() {
  return (
    <div className="aspect-square rounded-xl bg-aged-paper border border-desert-sand flex items-center justify-center">
      <div className="text-center">
        <Box className="h-12 w-12 text-stone-gray/50 mx-auto mb-3" />
        <p className="text-stone-gray">3D viewer will appear here</p>
        <p className="text-sm text-stone-gray/70 mt-1">
          Rotate and zoom to explore
        </p>
      </div>
    </div>
  );
}

function PhotosTab() {
  return (
    <div className="text-center py-8">
      <Image className="h-12 w-12 text-stone-gray/50 mx-auto mb-3" />
      <p className="text-stone-gray">No photos captured</p>
    </div>
  );
}

function InfoTab() {
  return (
    <div className="text-center py-8">
      <FileText className="h-12 w-12 text-stone-gray/50 mx-auto mb-3" />
      <p className="text-stone-gray">Info card not generated yet</p>
      <button className="mt-4 rounded-lg bg-terracotta px-6 py-2.5 font-medium text-bone-white transition-colors hover:bg-clay">
        Generate Info Card
      </button>
    </div>
  );
}

function ColorsTab() {
  return (
    <div className="text-center py-8">
      <Palette className="h-12 w-12 text-stone-gray/50 mx-auto mb-3" />
      <p className="text-stone-gray">No color variants yet</p>
      <button className="mt-4 rounded-lg bg-terracotta px-6 py-2.5 font-medium text-bone-white transition-colors hover:bg-clay">
        Generate Colors
      </button>
    </div>
  );
}
