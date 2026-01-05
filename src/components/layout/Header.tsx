import { useLocation, Link } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Relic AI',
  '/capture': 'Capture Artifact',
  '/gallery': 'My Artifacts',
  '/settings': 'Settings',
};

export function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Get title based on current path
  const getTitle = () => {
    // Check for dynamic routes first
    if (location.pathname.startsWith('/artifact/')) {
      return 'Artifact Details';
    }
    return pageTitles[location.pathname] || 'Relic AI';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-desert-sand bg-parchment/95 backdrop-blur-sm safe-area-top">
      <div className="flex h-14 items-center justify-center px-4">
        {isHomePage ? (
          <div className="flex items-center gap-2">
            <img
              src="/logo-32.png"
              alt="Relic AI"
              className="w-8 h-8 object-contain"
            />
            <h1 className="font-heading text-lg font-semibold text-sienna">
              {getTitle()}
            </h1>
          </div>
        ) : (
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <img
              src="/logo-32.png"
              alt="Relic AI"
              className="w-6 h-6 object-contain"
            />
            <h1 className="font-heading text-lg font-semibold text-sienna">
              {getTitle()}
            </h1>
          </Link>
        )}
      </div>
    </header>
  );
}
