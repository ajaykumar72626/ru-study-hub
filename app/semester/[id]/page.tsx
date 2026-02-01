import Link from "next/link";
import { notFound } from "next/navigation";

// --- OFFICIAL RANCHI UNIVERSITY SYLLABUS MAPPING (With Math/Physics) ---
const semesterData: Record<string, { title: string; subjects: { id: string; name: string }[] }> = {
  "1": {
    title: "Semester 1",
    subjects: [
      { id: "c1", name: "C1: Programming Fundamentals using C/C++" },
      { id: "c2", name: "C2: Computer System Architecture" },
      { id: "aecc1", name: "AECC: English/Hindi Communication" },
      { id: "ge1a", name: "GE 1A: Mathematics" },
      { id: "ge1b", name: "GE 1B: Physics" }
    ],
  },
  "2": {
    title: "Semester 2",
    subjects: [
      { id: "c3", name: "C3: Programming in JAVA" },
      { id: "c4", name: "C4: Discrete Structures" },
      { id: "aecc2", name: "AECC: Environmental Studies (EVS)" },
      { id: "ge2a", name: "GE 2A: Mathematics" },
      { id: "ge2b", name: "GE 2B: Physics" }
    ],
  },
  "3": {
    title: "Semester 3",
    subjects: [
      { id: "c5", name: "C5: Data Structures" },
      { id: "c6", name: "C6: Operating Systems" },
      { id: "c7", name: "C7: Computer Networks" },
      { id: "sec1", name: "SEC 1: Elem. Computer App Softwares" },
      { id: "ge3a", name: "GE 3A: Mathematics" },
      { id: "ge3b", name: "GE 3B: Physics" }
    ],
  },
  "4": {
    title: "Semester 4",
    subjects: [
      { id: "c8", name: "C8: Design and Analysis of Algorithms" },
      { id: "c9", name: "C9: Software Engineering Theory" },
      { id: "c10", name: "C10: Database Management Systems" },
      { id: "sec2", name: "SEC 2: HTML & PHP Programming" },
      { id: "ge4a", name: "GE 4A: Mathematics" },
      { id: "ge4b", name: "GE 4B: Physics" }
    ],
  },
  "5": {
    title: "Semester 5",
    subjects: [
      { id: "c11", name: "C11: Internet Technologies" },
      { id: "c12", name: "C12: Theory of Computation" },
      { id: "dse1", name: "DSE 1: Information Security" },
      { id: "dse2", name: "DSE 2: Cloud Computing" }
    ],
  },
  "6": {
    title: "Semester 6",
    subjects: [
      { id: "c13", name: "C13: Artificial Intelligence" },
      { id: "c14", name: "C14: Computer Graphics" },
      { id: "dse3", name: "DSE 3: Numerical Methods" },
      { id: "dse4", name: "DSE 4: OJT & Project Work" }
    ],
  },
};

export default async function SemesterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const semester = semesterData[id];

  if (!semester) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-gray-800">
            {semester.title}
          </h1>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="space-y-6">
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 text-center">
            <h2 className="text-blue-800 font-bold text-lg mb-1">
              Select a Paper
            </h2>
            <p className="text-sm text-blue-600/80">
              Choose a subject code below to view Syllabus, Notes, and PYQs.
            </p>
          </div>

          <div className="grid gap-4">
            {semester.subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/semester/${id}/${subject.id}`}
                className="group block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {subject.id.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                      {subject.name}
                    </h3>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}