import { Link } from 'react-router-dom';
import { Camera, Palette, Box, Sparkles, FolderOpen, Settings, ArrowRight, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-full overflow-hidden">
      {/* Decorative background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%238B4513' fill-opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Hero Section */}
      <section className="relative px-4 pt-6 pb-8 md:pt-10 md:pb-12">
        <div
          className={`flex flex-col items-center text-center transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Logo */}
          <div className="relative mb-4 md:mb-6">
            <div
              className="absolute inset-0 blur-2xl bg-gradient-to-br from-terracotta/20 via-desert-sand/30 to-sienna/20 rounded-full scale-150"
              style={{ animationDelay: '0.2s' }}
            />
            <img
              src="/logo.png"
              alt="Relic AI"
              className="relative w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-lg"
            />
          </div>

          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-sienna tracking-tight mb-3">
            Relic AI
          </h1>

          {/* Tagline */}
          <p className="text-stone-gray text-base md:text-lg max-w-md leading-relaxed">
            Uncover the past with AI-powered archaeological documentation
          </p>

          {/* Decorative line */}
          <div className="flex items-center gap-3 mt-5">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-desert-sand" />
            <div className="w-2 h-2 rotate-45 bg-terracotta/60" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-desert-sand" />
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="px-4 pb-8">
        <div
          className={`transition-all duration-1000 ease-out delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-heading text-lg md:text-xl font-semibold text-charcoal mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-terracotta rounded-full" />
            Choose Your Tool
          </h2>

          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {/* Save The Past Card */}
            <Link
              to="/capture"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-aged-paper to-parchment border border-desert-sand/80 p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-sienna/10 hover:border-clay hover:-translate-y-1"
            >
              {/* Card background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-terracotta/5 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-sienna/5 to-transparent rounded-tr-full" />

              <div className="relative">
                {/* Icon cluster */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-terracotta to-clay shadow-lg shadow-terracotta/20">
                    <Box className="w-6 h-6 text-bone-white" />
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-sienna/10 flex items-center justify-center">
                      <Camera className="w-4 h-4 text-sienna" />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-oxidized-bronze/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-oxidized-bronze" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl md:text-2xl font-bold text-sienna mb-2 group-hover:text-terracotta transition-colors">
                  Save The Past
                </h3>
                <p className="text-stone-gray text-sm md:text-base leading-relaxed mb-4">
                  Transform artifact photos into stunning 3D models with AI-generated scholarly analysis cards.
                </p>

                {/* Features list */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-sienna/10 text-sienna text-xs font-medium">
                    <Box className="w-3 h-3" />
                    3D Models
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-oxidized-bronze/10 text-oxidized-bronze text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    AI Analysis
                  </span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-terracotta font-medium text-sm group-hover:gap-3 transition-all">
                  Start Capturing
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* PastPalette Card */}
            <Link
              to="/capture?mode=colorize"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-aged-paper to-parchment border border-desert-sand/80 p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-desert-teal/10 hover:border-desert-teal/50 hover:-translate-y-1"
            >
              {/* Card background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-desert-teal/5 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-oxidized-bronze/5 to-transparent rounded-tr-full" />

              <div className="relative">
                {/* Icon with color swatches */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-desert-teal to-oxidized-bronze shadow-lg shadow-desert-teal/20">
                    <Palette className="w-6 h-6 text-bone-white" />
                  </div>
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 rounded-full bg-terracotta border-2 border-parchment shadow-sm" />
                    <div className="w-6 h-6 rounded-full bg-gold-ochre border-2 border-parchment shadow-sm" />
                    <div className="w-6 h-6 rounded-full bg-oxidized-bronze border-2 border-parchment shadow-sm" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl md:text-2xl font-bold text-desert-teal mb-2 group-hover:text-oxidized-bronze transition-colors">
                  PastPalette
                </h3>
                <p className="text-stone-gray text-sm md:text-base leading-relaxed mb-4">
                  Restore historical colors to weathered artifacts using culturally-authentic AI colorization.
                </p>

                {/* Features list */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-desert-teal/10 text-desert-teal text-xs font-medium">
                    <Palette className="w-3 h-3" />
                    Colorization
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gold-ochre/10 text-gold-ochre text-xs font-medium">
                    <Layers className="w-3 h-3" />
                    Multi-Style
                  </span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-desert-teal font-medium text-sm group-hover:gap-3 transition-all">
                  Restore Colors
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="px-4 pb-8">
        <div
          className={`transition-all duration-1000 ease-out delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-heading text-lg md:text-xl font-semibold text-charcoal mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-oxidized-bronze rounded-full" />
            Quick Access
          </h2>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Link
              to="/gallery"
              className="group flex items-center gap-3 rounded-xl bg-aged-paper/80 backdrop-blur-sm border border-desert-sand/60 p-4 transition-all duration-200 hover:bg-aged-paper hover:border-clay hover:shadow-md"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sienna/10 group-hover:bg-sienna/20 transition-colors">
                <FolderOpen className="w-5 h-5 text-sienna" />
              </div>
              <div className="min-w-0">
                <span className="block font-medium text-charcoal text-sm md:text-base truncate">Gallery</span>
                <span className="block text-xs text-stone-gray truncate">View artifacts</span>
              </div>
            </Link>

            <Link
              to="/settings"
              className="group flex items-center gap-3 rounded-xl bg-aged-paper/80 backdrop-blur-sm border border-desert-sand/60 p-4 transition-all duration-200 hover:bg-aged-paper hover:border-clay hover:shadow-md"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-gray/10 group-hover:bg-stone-gray/20 transition-colors">
                <Settings className="w-5 h-5 text-stone-gray" />
              </div>
              <div className="min-w-0">
                <span className="block font-medium text-charcoal text-sm md:text-base truncate">Settings</span>
                <span className="block text-xs text-stone-gray truncate">Preferences</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* About/Info Section */}
      <section className="px-4 pb-8">
        <div
          className={`transition-all duration-1000 ease-out delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sienna/5 via-aged-paper to-desert-sand/10 border border-desert-sand/40 p-5 md:p-6">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full text-sienna/10">
                <path d="M100 0 L100 100 L0 100 Z" fill="currentColor" />
              </svg>
            </div>

            <div className="relative">
              <h3 className="font-heading text-base md:text-lg font-semibold text-sienna mb-2">
                Preserving History, One Artifact at a Time
              </h3>
              <p className="text-stone-gray text-sm leading-relaxed max-w-lg">
                Relic AI combines cutting-edge artificial intelligence with archaeological expertise
                to help researchers, students, and enthusiasts document and understand historical artifacts.
              </p>

              {/* Stats or highlights */}
              <div className="flex flex-wrap gap-4 md:gap-6 mt-4 pt-4 border-t border-desert-sand/40">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-terracotta" />
                  <span className="text-xs text-stone-gray">AI-Powered Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-desert-teal" />
                  <span className="text-xs text-stone-gray">Offline-First</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-oxidized-bronze" />
                  <span className="text-xs text-stone-gray">Open Source</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacing for mobile nav */}
      <div className="h-4 md:h-8" />
    </div>
  );
}
