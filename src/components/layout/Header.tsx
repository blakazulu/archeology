import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Save The Past',
  '/capture': 'Capture Artifact',
  '/gallery': 'My Artifacts',
  '/settings': 'Settings',
};

export function Header() {
  const location = useLocation();

  // Get title based on current path
  const getTitle = () => {
    // Check for dynamic routes first
    if (location.pathname.startsWith('/artifact/')) {
      return 'Artifact Details';
    }
    return pageTitles[location.pathname] || 'Save The Past';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-desert-sand bg-parchment safe-area-top">
      <div className="flex h-14 items-center justify-center px-4">
        <h1 className="font-heading text-lg font-semibold text-sienna">
          {getTitle()}
        </h1>
      </div>
    </header>
  );
}
