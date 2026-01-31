import Link from "next/link";

export default function Home() {
  // We define our semesters here to loop through them easily
  const semesters = [
    { id: 1, title: "Semester 1", desc: "C Programming, Maths, Architecture" },
    { id: 2, title: "Semester 2", desc: "Java, Discrete Maths, EVS" },
    { id: 3, title: "Semester 3", desc: "Data Structures, OS, Networking" },
    { id: 4, title: "Semester 4", desc: "Algorithms, Software Eng, DBMS" },
    { id: 5, title: "Semester 5", desc: "Internet Tech, Theory of Comp" },
    { id: 6, title: "Semester 6", desc: "AI, IoT, Project Work" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* --- HEADER --- */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Simple Text Logo for now */}
            <h1 className="text-xl font-bold text-blue-700 tracking-tight">
              RU Study Hub
            </h1>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
              Beta
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <Link href="#" className="hover:text-blue-600">About</Link>
            <Link href="#" className="hover:text-blue-600">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* --- HERO SECTION --- */}
        <section className="bg-blue-700 text-white py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Your Digital Library for <br/> Ranchi University
            </h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
              Get compiled notes, previous year questions, and syllabus breakdowns 
              specifically tailored for the BCA curriculum.
            </p>
          </div>
        </section>

        {/* --- SEMESTER GRID --- */}
        <section className="max-w-6xl mx-auto px-4 py-12 -mt-8">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Select Your Semester
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {semesters.map((sem) => (
                <Link 
                  key={sem.id} 
                  href={`/semester/${sem.id}`}
                  className="group relative block p-6 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-700">
                      {sem.title}
                    </h4>
                    <span className="text-gray-300 group-hover:text-blue-500">
                      →
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {sem.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section className="max-w-6xl mx-auto px-4 py-8 mb-12">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-bold text-gray-800">Verified Notes</h3>
              <p className="text-sm text-gray-500">Hand-typed and checked against the official RU syllabus.</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">📝</div>
              <h3 className="font-bold text-gray-800">PYQ Archive</h3>
              <p className="text-sm text-gray-500">Last 3 years of question papers digitized for easy search.</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-gray-800">Exam Focused</h3>
              <p className="text-sm text-gray-500">Content optimized for scoring high in semester exams.</p>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} RU Study Hub. Built with ❤️ for Students.</p>
      </footer>
    </div>
  );
}