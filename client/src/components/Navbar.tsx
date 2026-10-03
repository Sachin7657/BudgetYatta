import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, History, Menu, X, Plane } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-base-100/85 backdrop-blur-md shadow-xs border-b border-base-200'
          : 'bg-transparent border-b border-base-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand Tagline */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
            aria-label="BudgetYatta Home"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-5 h-5 animate-spin-slow group-hover:rotate-45 transition-transform duration-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-500 border-2 border-base-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-base-content flex items-center gap-1.5 leading-none">
                BudgetYatta
                <span className="badge badge-primary badge-xs font-bold text-[10px] uppercase px-1.5 py-0.5 rounded-md">
                  Smart Plan
                </span>
              </span>
              <span className="text-[11px] text-base-content/60 font-semibold tracking-wider uppercase mt-1">
                Wanderlust • On Budget
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-base-200/60 p-1.5 rounded-2xl border border-base-300/40">
            <Link
              to="/"
              className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-base-100 text-primary shadow-xs'
                  : 'text-base-content/75 hover:text-base-content hover:bg-base-100/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Plan a Trip</span>
            </Link>

            <Link
              to="/trips"
              className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                isActive('/trips')
                  ? 'bg-base-100 text-primary shadow-xs'
                  : 'text-base-content/75 hover:text-base-content hover:bg-base-100/50'
              }`}
            >
              <History className="w-4 h-4 text-teal-600" />
              <span>Saved Trips</span>
            </Link>
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex btn btn-sm btn-primary rounded-xl font-bold shadow-xs hover:shadow-md transition-all gap-1.5 px-4"
            >
              <Plane className="w-4 h-4" />
              <span>New Journey</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="md:hidden btn btn-ghost btn-sm btn-square rounded-xl min-h-[44px] min-w-[44px] border border-base-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-base-200 bg-base-100/98 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fade-in-up">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold min-h-[48px] ${
              isActive('/') && location.pathname === '/'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-base-content/80 hover:bg-base-200'
            }`}
          >
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span>Plan a Trip</span>
          </Link>
          <Link
            to="/trips"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold min-h-[48px] ${
              isActive('/trips')
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-base-content/80 hover:bg-base-200'
            }`}
          >
            <History className="w-5 h-5 text-teal-600" />
            <span>Saved Itineraries</span>
          </Link>
        </div>
      )}
    </header>
  );
};
