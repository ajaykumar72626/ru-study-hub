"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Search History State
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Syllabus", href: "/syllabus" },
    { name: "Notes", href: "/notes" },
    { name: "PYQs", href: "/pyq" },
    { name: "Mock Tests", href: "/mock-tests" },
  ];

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("ru_search_history");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Close history when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      executeSearch(searchQuery);
    }
  };

  const executeSearch = (query: string) => {
    if (!query.trim()) return;
    
    // Save to history (keep top 5 unique)
    const updatedHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5); 
    setSearchHistory(updatedHistory);
    localStorage.setItem("ru_search_history", JSON.stringify(updatedHistory));

    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsMobileMenuOpen(false); 
    setShowHistory(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowHistory(false); 
  };

  const removeHistoryItem = (e: React.MouseEvent, itemToRemove: string) => {
    e.stopPropagation(); // Prevent triggering selection
    const updated = searchHistory.filter(item => item !== itemToRemove);
    setSearchHistory(updated);
    localStorage.setItem("ru_search_history", JSON.stringify(updated));
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          
          {/* --- LOGO SECTION --- */}
          {/* Mobile: Centered Absolute | Desktop: Left Relative */}
          <div className="flex-shrink-0 z-10 absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none lg:left-auto">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-700 tracking-tight">
                RU Study Hub
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                Beta
              </span>
            </Link>
          </div>

          {/* --- DESKTOP NAVIGATION (Centered) --- */}
          <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive(link.href) ? "text-blue-600 font-bold" : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* --- RIGHT SIDE TOOLS --- */}
          {/* Desktop: Search | Mobile: Hamburger Menu */}
          <div className="flex items-center gap-4 z-10 ml-auto">
            
            {/* Desktop Search */}
            <div className="hidden lg:block relative w-64" ref={searchContainerRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  onFocus={() => setShowHistory(true)}
                />
                {searchQuery && (
                  <button 
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Desktop History Dropdown */}
              {showHistory && searchHistory.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase bg-gray-50">
                    Recent Searches
                  </div>
                  <ul>
                    {searchHistory.map((term, index) => (
                      <li key={index} className="border-b border-gray-50 last:border-none">
                        <div 
                          className="flex justify-between items-center px-4 py-2 hover:bg-blue-50 cursor-pointer group"
                          onClick={() => {
                            setSearchQuery(term);
                            executeSearch(term);
                          }}
                        >
                          <span className="text-sm text-gray-600 group-hover:text-blue-700">{term}</span>
                          <button 
                            onClick={(e) => removeHistoryItem(e, term)}
                            className="text-gray-300 hover:text-red-500 text-xs px-1"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Mobile Menu Button (Hamburger) */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none p-2"
                aria-label="Toggle menu"
              >
                {/* Switch between Hamburger and X icon */}
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full z-40">
          <div className="px-4 pt-4 pb-4 space-y-4">
             
             {/* Mobile Search */}
             <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Search notes, PYQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
               {searchQuery && (
                  <button 
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
            </div>

            {/* Mobile Nav Links (Centered) */}
            <div className="flex flex-col space-y-2 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}