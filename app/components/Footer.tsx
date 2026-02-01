import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Added text-center for mobile, md:text-left for desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          
          {/* Column 1: Brand */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm shadow-lg shadow-blue-900/50">RU</span>
              Study Hub
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              The open-source digital library for Ranchi University students. 
              Built to make semester exams easier and notes accessible to everyone.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/syllabus" className="hover:text-blue-400 transition-colors">Syllabus</Link></li>
              <li><Link href="/notes" className="hover:text-blue-400 transition-colors">Notes Library</Link></li>
              <li><Link href="/pyq" className="hover:text-blue-400 transition-colors">Previous Year Questions</Link></li>
              <li><Link href="/mock-tests" className="hover:text-blue-400 transition-colors">Mock Tests</Link></li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Community</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Join WhatsApp Group</a></li>
              <li className="text-xs text-slate-600 mt-6 font-mono">v1.0.0 (Beta)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>© {currentYear} RU Study Hub. Designed & Developed by <span className="text-slate-300">Ajay Kumar</span>.</p>
        </div>
      </div>
    </footer>
  );
}