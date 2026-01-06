import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout';
import { ErrorBoundary } from './components/ui';
import { LoadingScreen } from './components/ui';
import './i18n'; // Initialize i18n
import './index.css';

// Lazy load pages for better performance
const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

// Save the Past section
const SaveThePastPage = lazy(() =>
  import('./pages/SaveThePastPage').then((m) => ({ default: m.SaveThePastPage }))
);
const SaveGalleryPage = lazy(() =>
  import('./pages/SaveGalleryPage').then((m) => ({ default: m.SaveGalleryPage }))
);
const SaveArtifactDetailPage = lazy(() =>
  import('./pages/SaveArtifactDetailPage').then((m) => ({
    default: m.SaveArtifactDetailPage,
  }))
);

// Past Palette section
const PastPalettePage = lazy(() =>
  import('./pages/PastPalettePage').then((m) => ({ default: m.PastPalettePage }))
);
const PaletteGalleryPage = lazy(() =>
  import('./pages/PaletteGalleryPage').then((m) => ({ default: m.PaletteGalleryPage }))
);
const PaletteArtifactDetailPage = lazy(() =>
  import('./pages/PaletteArtifactDetailPage').then((m) => ({
    default: m.PaletteArtifactDetailPage,
  }))
);

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route element={<Layout />}>
                {/* Home */}
                <Route path="/" element={<HomePage />} />

                {/* Save the Past - 3D Reconstruction */}
                <Route path="/save" element={<SaveThePastPage />} />
                <Route path="/save/gallery" element={<SaveGalleryPage />} />
                <Route path="/save/artifact/:id" element={<SaveArtifactDetailPage />} />

                {/* Past Palette - Colorization */}
                <Route path="/palette" element={<PastPalettePage />} />
                <Route path="/palette/gallery" element={<PaletteGalleryPage />} />
                <Route path="/palette/artifact/:id" element={<PaletteArtifactDetailPage />} />

                {/* Settings */}
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
