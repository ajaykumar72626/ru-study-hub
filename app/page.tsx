import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

// FIXED: Use revalidate = 0 instead of force-dynamic to avoid errors
// This ensures the page always fetches fresh data from Firebase
export const revalidate = 0;

// --- FETCH RECENT UPDATES (Server Side) ---
async function getRecentUpdates() {
  const updates: any[] = [];
  try {
    // 1. Fetch latest 3 Notes
    const notesQ = query(collection(db, "notes"), orderBy("createdAt", "desc"), limit(3));
    const notesSnap = await getDocs(notesQ);
    notesSnap.forEach(doc => {
      const data = doc.data();
      updates.push({
        id: doc.id,
        type: "Note",
        title: data.unitTitle,
        details: `Sem ${data.semester} • ${data.subjectId.toUpperCase()}`,
        link: `/semester/${data.semester}/${data.subjectId}?view=notes`,
        date: data.createdAt?.seconds || 0
      });
    });

    // 2. Fetch latest 3 PYQs
    const pyqQ = query(collection(db, "pyq"), orderBy("createdAt", "desc"), limit(3));
    const pyqSnap = await getDocs(pyqQ);
    pyqSnap.forEach(doc => {
      const data = doc.data();
      updates.push({
        id: doc.id,
        type: "PYQ",
        title: `${data.year} Question Paper`,
        details: `Sem ${data.semester} • ${data.subjectId.toUpperCase()}`,
        link: `/pyq/view/${doc.id}`,
        date: data.createdAt?.seconds || 0
      });
    });

  } catch (error) {
    console.error("Error fetching updates:", error);
  }

  // Combine, Sort by Date (Newest First), and take top 4
  return updates.sort((a, b) => b.date - a.date).slice(0, 4);
}

export default async function Home() {
  const recentItems = await getRecentUpdates();

  const semesters = [
    { id: 1, title: "Semester 1", desc: "C Programming, Maths, Architecture, Physics" },
    { id: 2, title: "Semester 2", desc: "Java, Discrete Maths, EVS, Maths, Physics" },
    { id: 3, title: "Semester 3", desc: "Data Structures, OS, Networking, Maths, Physics" },
    { id: 4, title: "Semester 4", desc: "Algorithms, Software Eng, DBMS, Maths, Physics" },
    { id: 5, title: "Semester 5", desc: "Internet Tech, Theory of Comp, Cloud Computing" },
    { id: 6, title: "Semester 6", desc: "AI, Graphics, Numerical Methods, Project Work" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER REMOVED - Using Global Navbar from layout.tsx */}

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

        {/* --- RECENT UPDATES SECTION (Now Updates Instantly) --- */}
        {recentItems.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 pt-12 -mb-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📢</span> Recently Added
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentItems.map((item) => (
                  <Link 
                    key={item.id} 
                    href={item.link}
                    className="block bg-white p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.type === 'Note' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.type}
                      </span>
                      <span className="text-gray-300 text-xs">New</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* --- SEMESTER GRID --- */}
        <section className="max-w-6xl mx-auto px-4 py-12">
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

      {/* FOOTER REMOVED - Using Global Footer from layout.tsx */}
    </div>
  );
}