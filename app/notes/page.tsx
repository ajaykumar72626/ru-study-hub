import Link from "next/link";
import { Metadata } from "next";

// --- SEO METADATA ---
export const metadata: Metadata = {
  title: "BCA Notes Library | Ranchi University | RU Study Hub",
  description: "Free, verified study notes for BCA Honours (Sem 1-6) under Ranchi University. Covers C, Java, AI, and more.",
  keywords: ["Ranchi University Notes", "BCA Notes", "RU Study Hub", "Semester 1 Notes", "Computer Application Notes"],
};

// --- OFFICIAL SYLLABUS MAPPING ---
const ALL_SEMESTERS = [
  {
    id: "1",
    title: "Semester 1",
    subjects: [
      { id: "c1", name: "C1: Programming Fundamentals using C/C++" },
      { id: "c2", name: "C2: Computer System Architecture" },
      { id: "aecc1", name: "AECC: English/Hindi Communication" },
      { id: "ge1a", name: "GE 1A: Mathematics" },
      { id: "ge1b", name: "GE 1B: Physics" }
    ]
  },
  {
    id: "2",
    title: "Semester 2",
    subjects: [
      { id: "c3", name: "C3: Programming in JAVA" },
      { id: "c4", name: "C4: Discrete Structures" },
      { id: "aecc2", name: "AECC: Environmental Studies (EVS)" },
      { id: "ge2a", name: "GE 2A: Mathematics" },
      { id: "ge2b", name: "GE 2B: Physics" }
    ]
  },
  {
    id: "3",
    title: "Semester 3",
    subjects: [
      { id: "c5", name: "C5: Data Structures" },
      { id: "c6", name: "C6: Operating Systems" },
      { id: "c7", name: "C7: Computer Networks" },
      { id: "sec1", name: "SEC 1: Elem. Computer App Softwares" },
      { id: "ge3a", name: "GE 3A: Mathematics" },
      { id: "ge3b", name: "GE 3B: Physics" }
    ]
  },
  {
    id: "4",
    title: "Semester 4",
    subjects: [
      { id: "c8", name: "C8: Design and Analysis of Algorithms" },
      { id: "c9", name: "C9: Software Engineering Theory" },
      { id: "c10", name: "C10: Database Management Systems" },
      { id: "sec2", name: "SEC 2: HTML & PHP Programming" },
      { id: "ge4a", name: "GE 4A: Mathematics" },
      { id: "ge4b", name: "GE 4B: Physics" }
    ]
  },
  {
    id: "5",
    title: "Semester 5",
    subjects: [
      { id: "c11", name: "C11: Internet Technologies" },
      { id: "c12", name: "C12: Theory of Computation" },
      { id: "dse1", name: "DSE 1: Information Security" },
      { id: "dse2", name: "DSE 2: Cloud Computing" }
    ]
  },
  {
    id: "6",
    title: "Semester 6",
    subjects: [
      { id: "c13", name: "C13: Artificial Intelligence" },
      { id: "c14", name: "C14: Computer Graphics" },
      { id: "dse3", name: "DSE 3: Numerical Methods" },
      { id: "dse4", name: "DSE 4: OJT & Project Work" }
    ]
  }
];

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section */}
      <div className="bg-blue-700 text-white py-12 px-4 text-center shadow-md">
        <h1 className="text-3xl font-bold mb-2">Study Notes Library</h1>
        <p className="text-blue-100 max-w-2xl mx-auto">
          Comprehensive, hand-typed notes for every unit. Optimized for quick revision and exam preparation.
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10 w-full flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_SEMESTERS.map((sem) => (
            <div 
              key={sem.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Card Header */}
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{sem.title}</h2>
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Verified
                </span>
              </div>

              {/* Subject List */}
              <div className="p-4">
                <ul className="space-y-2">
                  {sem.subjects.map((sub) => (
                    <li key={sub.id}>
                      <Link 
                        href={`/semester/${sem.id}/${sub.id}?view=notes`}
                        className="group flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <span className="text-sm text-gray-600 group-hover:text-blue-700 font-medium truncate pr-2">
                          {sub.name}
                        </span>
                        <span className="text-gray-300 group-hover:text-blue-500 text-xs">
                          ➜
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {/* Helper Note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Note: Notes are constantly updated. Check back before exams for the latest versions.
          </p>
        </div>
      </main>
    </div>
  );
}