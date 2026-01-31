import Link from "next/link";
import { notFound } from "next/navigation";

// Updated Data Structure: Subjects now have an ID for the URL
const semesterData: Record<string, { title: string; subjects: { id: string; name: string }[] }> = {
  "1": {
    title: "Semester 1",
    subjects: [
      { id: "c-programming", name: "Programming in C" },
      { id: "architecture", name: "Computer System Architecture" },
      { id: "maths-1", name: "Mathematics-I" },
      { id: "comm-skills", name: "Professional Communication" }
    ],
  },
  "2": {
    title: "Semester 2",
    subjects: [
      { id: "java", name: "Programming in Java" },
      { id: "discrete-maths", name: "Discrete Mathematics" },
      { id: "evs", name: "Environmental Science" },
      { id: "digital-electronics", name: "Digital Electronics" }
    ],
  },
  "3": {
    title: "Semester 3",
    subjects: [
      { id: "dsa", name: "Data Structures" },
      { id: "os", name: "Operating Systems" },
      { id: "networks", name: "Computer Networks" },
      { id: "web-tech", name: "Web Technology" }
    ],
  },
  "4": {
    title: "Semester 4",
    subjects: [
      { id: "algorithms", name: "Design & Analysis of Algorithms" },
      { id: "software-eng", name: "Software Engineering" },
      { id: "dbms", name: "Database Management Systems (DBMS)" },
      { id: "numerical", name: "Numerical Methods" }
    ],
  },
  "5": {
    title: "Semester 5",
    subjects: [
      { id: "internet-tech", name: "Internet Technologies" },
      { id: "toc", name: "Theory of Computation" },
      { id: "data-mining", name: "DSE-1: Data Mining" },
      { id: "image-processing", name: "DSE-2: Image Processing" }
    ],
  },
  "6": {
    title: "Semester 6",
    subjects: [
      { id: "ai", name: "Artificial Intelligence" },
      { id: "graphics", name: "Computer Graphics" },
      { id: "project", name: "Major Project" },
      { id: "iot", name: "DSE-3: IoT" }
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
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
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h2 className="text-blue-800 font-semibold mb-1">
              Select a Subject
            </h2>
            <p className="text-sm text-blue-600">
              Choose a subject below to view Units, Notes, and PYQs.
            </p>
          </div>

          <div className="grid gap-4">
            {semester.subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/semester/${id}/${subject.id}`}
                className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
                    {subject.name}
                  </h3>
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded group-hover:bg-blue-100 group-hover:text-blue-700">
                    View Resources →
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