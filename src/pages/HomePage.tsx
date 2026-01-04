import { Link } from 'react-router-dom';
import { Camera, FolderOpen, Palette, Sparkles } from 'lucide-react';

export function HomePage() {
  return (
    <div className="px-4 py-6">
      {/* Hero Section */}
      <section className="mb-8 text-center">
        <h2 className="font-heading text-2xl font-bold text-sienna mb-2">
          Welcome to Save The Past
        </h2>
        <p className="text-stone-gray">
          Document and analyze archaeological artifacts with AI-powered tools
        </p>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4 mb-8">
        <h3 className="font-heading text-lg font-semibold text-charcoal">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/capture"
            className="flex flex-col items-center gap-3 rounded-xl bg-aged-paper p-6 border border-desert-sand shadow-sm transition-all hover:shadow-md hover:border-clay"
          >
            <div className="rounded-full bg-terracotta/10 p-3">
              <Camera className="h-8 w-8 text-terracotta" />
            </div>
            <span className="font-medium text-charcoal">Capture Artifact</span>
          </Link>

          <Link
            to="/gallery"
            className="flex flex-col items-center gap-3 rounded-xl bg-aged-paper p-6 border border-desert-sand shadow-sm transition-all hover:shadow-md hover:border-clay"
          >
            <div className="rounded-full bg-sienna/10 p-3">
              <FolderOpen className="h-8 w-8 text-sienna" />
            </div>
            <span className="font-medium text-charcoal">View Gallery</span>
          </Link>
        </div>
      </section>

      {/* Features Overview */}
      <section className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-charcoal">
          Features
        </h3>

        <div className="space-y-3">
          <FeatureCard
            icon={Camera}
            title="3D Reconstruction"
            description="Create 3D models from photos using AI"
            color="terracotta"
          />
          <FeatureCard
            icon={Sparkles}
            title="AI Info Cards"
            description="Generate archaeological analysis cards"
            color="oxidized-bronze"
          />
          <FeatureCard
            icon={Palette}
            title="Color Restoration"
            description="Visualize artifacts in historical colors"
            color="desert-teal"
          />
        </div>
      </section>

      {/* Empty State for Recent */}
      <section className="mt-8">
        <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">
          Recent Artifacts
        </h3>
        <div className="rounded-xl border-2 border-dashed border-desert-sand bg-aged-paper/50 p-8 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-stone-gray/50 mb-3" />
          <p className="text-stone-gray">No artifacts yet</p>
          <p className="text-sm text-stone-gray/70 mt-1">
            Capture your first artifact to get started
          </p>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: 'terracotta' | 'oxidized-bronze' | 'desert-teal';
}

function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    terracotta: 'bg-terracotta/10 text-terracotta',
    'oxidized-bronze': 'bg-oxidized-bronze/10 text-oxidized-bronze',
    'desert-teal': 'bg-desert-teal/10 text-desert-teal',
  };

  return (
    <div className="flex items-center gap-4 rounded-xl bg-aged-paper p-4 border border-desert-sand">
      <div className={`rounded-full p-2 ${colorClasses[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-medium text-charcoal">{title}</h4>
        <p className="text-sm text-stone-gray">{description}</p>
      </div>
    </div>
  );
}
