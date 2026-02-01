import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string; 
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    // Added overflow-x-auto and whitespace-nowrap for mobile scrolling
    <nav className="flex text-sm font-medium text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link href="/" className="inline-flex items-center hover:text-blue-600 transition-colors">
            <svg className="w-3 h-3 mr-2.5 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
            </svg>
            Home
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              {item.href ? (
                <Link href={item.href} className="ml-1 text-sm font-medium hover:text-blue-600 md:ml-2 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2">
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}git add .
git commit -m "Update Navbar: Instant search and clear-to-home logic"
git push