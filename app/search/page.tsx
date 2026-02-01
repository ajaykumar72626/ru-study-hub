"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// --- OFFICIAL SYLLABUS DATA FOR SEARCH ---
const OFFICIAL_MAPPING = [
  { id: "1", title: "Semester 1", subjects: [ { id: "c1", name: "C1: Programming Fundamentals using C/C++" }, { id: "c2", name: "C2: Computer System Architecture" }, { id: "aecc1", name: "AECC: English/Hindi Communication" }, { id: "ge1a", name: "GE 1A: Mathematics" }, { id: "ge1b", name: "GE 1B: Physics" } ] },
  { id: "2", title: "Semester 2", subjects: [ { id: "c3", name: "C3: Programming in JAVA" }, { id: "c4", name: "C4: Discrete Structures" }, { id: "aecc2", name: "AECC: Environmental Studies (EVS)" }, { id: "ge2a", name: "GE 2A: Mathematics" }, { id: "ge2b", name: "GE 2B: Physics" } ] },
  { id: "3", title: "Semester 3", subjects: [ { id: "c5", name: "C5: Data Structures" }, { id: "c6", name: "C6: Operating Systems" }, { id: "c7", name: "C7: Computer Networks" }, { id: "sec1", name: "SEC 1: Elem. Computer App Softwares" }, { id: "ge3a", name: "GE 3A: Mathematics" }, { id: "ge3b", name: "GE 3B: Physics" } ] },
  { id: "4", title: "Semester 4", subjects: [ { id: "c8", name: "C8: Design and Analysis of Algorithms" }, { id: "c9", name: "C9: Software Engineering Theory" }, { id: "c10", name: "C10: Database Management Systems" }, { id: "sec2", name: "SEC 2: HTML & PHP Programming" }, { id: "ge4a", name: "GE 4A: Mathematics" }, { id: "ge4b", name: "GE 4B: Physics" } ] },
  { id: "5", title: "Semester 5", subjects: [ { id: "c11", name: "C11: Internet Technologies" }, { id: "c12", name: "C12: Theory of Computation" }, { id: "dse1", name: "DSE 1: Information Security" }, { id: "dse2", name: "DSE 2: Cloud Computing" } ] },
  { id: "6", title: "Semester 6", subjects: [ { id: "c13", name: "C13: Artificial Intelligence" }, { id: "c14", name: "C14: Computer Graphics" }, { id: "dse3", name: "DSE 3: Numerical Methods" }, { id: "dse4", name: "DSE 4: OJT & Project Work" } ] }
];

type SearchResult = {
  id: string;
  type: "note" | "pyq" | "subject" | "semester";
  title: string;
  subtitle: string;
  link: string;
};

function SearchResults() {
  const searchParams = useSearchParams();
  const queryText = searchParams.get("q")?.toLowerCase() || "";
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function performSearch() {
      if (!queryText) return;
      setLoading(true);
      const tempResults: SearchResult[] = [];

      try {
        // 1. SEARCH STATIC MAPPING (Semesters & Subjects)
        OFFICIAL_MAPPING.forEach(sem => {
            // Check Semester Match
            if (sem.title.toLowerCase().includes(queryText)) {
                tempResults.push({
                    id: `sem-${sem.id}`,
                    type: "semester",
                    title: sem.title,
                    subtitle: "Browse all papers in this semester",
                    link: `/semester/${sem.id}`
                });
            }
            // Check Subject Match
            sem.subjects.forEach(sub => {
                if (sub.name.toLowerCase().includes(queryText) || sub.id.toLowerCase().includes(queryText)) {
                    tempResults.push({
                        id: sub.id,
                        type: "subject",
                        title: sub.name,
                        subtitle: `${sem.title} • Syllabus & Resources`,
                        link: `/semester/${sem.id}/${sub.id}?view=syllabus`
                    });
                }
            });
        });

        // 2. SEARCH DB: Notes
        const notesSnap = await getDocs(query(collection(db, "notes"), orderBy("createdAt", "desc"), limit(20)));
        notesSnap.forEach(doc => {
          const data = doc.data();
          const title = data.unitTitle?.toLowerCase() || "";
          const subject = data.subjectId?.toLowerCase() || "";
          
          if (title.includes(queryText) || subject.includes(queryText)) {
            tempResults.push({
              id: doc.id,
              type: "note",
              title: data.unitTitle,
              subtitle: `Note • Sem ${data.semester} • ${data.subjectId.toUpperCase()}`,
              link: `/semester/${data.semester}/${data.subjectId}?view=notes`
            });
          }
        });

        // 3. SEARCH DB: PYQs
        const pyqSnap = await getDocs(query(collection(db, "pyq"), orderBy("createdAt", "desc"), limit(20)));
        pyqSnap.forEach(doc => {
          const data = doc.data();
          const year = data.year?.toString() || "";
          const subject = data.subjectId?.toLowerCase() || "";

          if (year.includes(queryText) || subject.includes(queryText)) {
            tempResults.push({
              id: doc.id,
              type: "pyq",
              title: `${data.year} Question Paper`,
              subtitle: `PYQ • Sem ${data.semester} • ${data.subjectId.toUpperCase()}`,
              link: `/pyq/view/${doc.id}`
            });
          }
        });

        setResults(tempResults);
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
        performSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [queryText]);

  if (!queryText) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-400">Type in the search bar to find resources...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Search Results for "<span className="text-blue-600">{queryText}</span>"
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No results found.</p>
          <p className="text-sm text-gray-400 mt-1">Try searching for a subject name (e.g., "Java") or year (e.g., "2023").</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((item) => (
            <Link 
              key={item.id} 
              href={item.link}
              className="block bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase min-w-[70px] text-center ${
                  item.type === 'note' ? 'bg-purple-100 text-purple-700' :
                  item.type === 'pyq' ? 'bg-orange-100 text-orange-700' :
                  item.type === 'semester' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {item.type}
                </span>
                <div>
                  <h3 className="font-bold text-gray-800">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="p-8 text-center">Loading search...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}