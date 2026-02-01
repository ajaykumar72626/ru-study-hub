"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
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

  useEffect(() => {
    const saved = localStorage.getItem("ru_search_history");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowHistory(false);
    } else {
      setShowHistory(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      saveToHistory(searchQuery);
      setShowHistory(false);
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const saveToHistory = (query: string) => {
    const updatedHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5); 
    setSearchHistory(updatedHistory);
    localStorage.setItem("ru_search_history", JSON.stringify(updatedHistory));
  };

  const executeHistorySearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setShowHistory(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowHistory(false);
    setIsMobileSearchOpen(false); // Close the mobile search bar
    router.push("/");
  };

  const removeHistoryItem = (e: React.MouseEvent, itemToRemove: string) => {
    e.stopPropagation();
    const updated = searchHistory.filter(item => item !== itemToRemove);
    setSearchHistory(updated);
    localStorage.setItem("ru_search_history", JSON.stringify(updated));
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        
        {/* --- MOBILE SEARCH OVERLAY (App-Like Behavior) --- */}
        {isMobileSearchOpen ? (
          <div className="lg:hidden flex items-center h-full w-full gap-2 animate-in fade-in zoom-in duration-200">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                autoFocus
                type="text"
                className="block w-full pl-10 pr-8 py-2 border border-blue-300 rounded-full leading-5 bg-blue-50/50 placeholder-blue-400 text-blue-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <button 
              onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(""); }}
              className="text-sm font-medium text-gray-600 whitespace-nowrap px-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center h-full">
            
            {/* --- LOGO SECTION --- */}
            <div className="flex-shrink-0 z-10 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-700 tracking-tight">
                  RU Study Hub
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold border border-blue-100">
                  BETA
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
            <div className="flex items-center gap-2 z-10 ml-auto">
              
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
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
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
                {showHistory && searchHistory.length > 0 && !searchQuery && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase bg-gray-50">
                      Recent Searches
                    </div>
                    <ul>
                      {searchHistory.map((term, index) => (
                        <li key={index} className="border-b border-gray-50 last:border-none">
                          <div 
                            className="flex justify-between items-center px-4 py-2 hover:bg-blue-50 cursor-pointer group"
                            onClick={() => executeHistorySearch(term)}
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

              {/* Mobile Search Icon Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => {
                    setIsMobileSearchOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-500 hover:bg-gray-100 focus:outline-none p-2 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <span className="text-xl">🔍</span>
                </button>
              </div>

              {/* Mobile Menu Button (Hamburger) */}
              <div className="lg:hidden">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                    setIsMobileSearchOpen(false); 
                  }}
                  className="text-gray-600 hover:text-blue-600 focus:outline-none p-2"
                  aria-label="Toggle menu"
                >
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
        )}
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobileMenuOpen && !isMobileSearchOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full z-40 animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-blue-50 text-blue-700 border border-blue-100 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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