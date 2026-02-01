import Link from "next/link";
import { db } from "@/app/lib/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import Breadcrumbs from "@/app/components/Breadcrumbs"; 
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string; subjectId: string }>;
  searchParams: Promise<{ view?: string }>;
};

type Note = { id: string; unitTitle: string; content: string; author: string; };
type Syllabus = { id: string; content: string; };
type Pyq = { id: string; year: string; content: string; fileUrl?: string; };

export default async function SubjectPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { id, subjectId } = resolvedParams;

  if (!id || !subjectId) {
    return notFound();
  }

  const activeTab = resolvedSearchParams?.view || "syllabus"; 

  // FETCH DATA
  const notes: Note[] = [];
  const pyqs: Pyq[] = [];
  let syllabusData: Syllabus | null = null;

  try {
    if (activeTab === "notes") {
      const q = query(collection(db, "notes"), where("semester", "==", id), where("subjectId", "==", subjectId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => notes.push({ id: doc.id, ...doc.data() } as Note));
      notes.sort((a, b) => a.unitTitle.localeCompare(b.unitTitle));
    } 
    
    if (activeTab === "syllabus") {
      const q = query(collection(db, "syllabus"), where("semester", "==", id), where("subjectId", "==", subjectId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        syllabusData = { id: doc.id, ...doc.data() } as Syllabus;
      }
    }

    if (activeTab === "pyq") {
      const q = query(collection(db, "pyq"), where("semester", "==", id), where("subjectId", "==", subjectId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => pyqs.push({ id: doc.id, ...doc.data() } as Pyq));
      pyqs.sort((a, b) => (b.year || "").localeCompare(a.year || ""));
    }
  } catch (error) {
    console.error("Firebase Query Error:", error);
  }

  const subjectName = subjectId.replace(/-/g, " ").toUpperCase();
  const getTabClass = (tabName: string) => activeTab === tabName ? "px-4 py-2 border-b-2 border-blue-600 text-blue-700 font-bold whitespace-nowrap" : "px-4 py-2 text-gray-500 hover:text-gray-800 whitespace-nowrap";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Reduced Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800 truncate">{subjectName}</h1>
          <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded">Sem {id}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 w-full">
        
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: `Semester ${id}`, href: `/semester/${id}` },
            { label: subjectName }
          ]} 
        />

        <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto">
          <Link href={`?view=syllabus`} className={getTabClass("syllabus")}>Syllabus</Link>
          <Link href={`?view=notes`} className={getTabClass("notes")}>Notes</Link>
          <Link href={`?view=pyq`} className={getTabClass("pyq")}>PYQs</Link>
        </div>

        <div className="space-y-6">
          {/* VIEW: NOTES */}
          {activeTab === "notes" && (
            notes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No notes found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  We are working on this subject. If you have good notes, help your juniors!
                </p>
                <a 
                  href={`mailto:support@rustudyhub.com?subject=Contribute Notes for Sem ${id} - ${subjectName}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  📤 Contribute Notes
                </a>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{note.unitTitle}</h2>
                  <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: note.content }} />
                </div>
              ))
            )
          )}

          {/* VIEW: SYLLABUS */}
          {activeTab === "syllabus" && (
            !syllabusData ? (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                 <p className="text-gray-500 mb-4">Syllabus not uploaded yet.</p>
                 <Link href="/admin/login" className="text-sm text-blue-600 hover:underline">Admin? Upload it now</Link>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Official Syllabus</h3>
                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: syllabusData.content }} />
              </div>
            )
          )}

          {/* VIEW: PYQ */}
          {activeTab === "pyq" && (
            pyqs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 mb-4">No previous year questions available.</p>
                <Link href="/contact" className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors">
                  Request PYQs
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {pyqs.map((paper) => (
                  <div key={paper.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-all">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {paper.year} Question Paper
                        {paper.fileUrl && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">PDF</span>}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                        {paper.content ? "Includes text solution/notes" : "Official Scan"}
                      </p>
                    </div>
                    <Link 
                      href={`/pyq/view/${paper.id}`}
                      className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      View Paper
                    </Link>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* --- RELATED CONTENT LOOP --- */}
        <div className="mt-12 border-t border-gray-100 pt-8">
          <h4 className="font-bold text-gray-800 text-lg mb-4">What's Next?</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {activeTab !== "notes" && (
              <Link href="?view=notes" className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📚</div>
                <div><h5 className="font-bold text-gray-800 group-hover:text-blue-600">Start Reading Notes</h5><p className="text-xs text-gray-500">Deep dive into unit-wise topics.</p></div>
              </Link>
            )}

            {activeTab !== "pyq" && (
              <Link href="?view=pyq" className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📝</div>
                <div><h5 className="font-bold text-gray-800 group-hover:text-purple-600">Check Past Papers</h5><p className="text-xs text-gray-500">See what questions appeared in 2022-24.</p></div>
              </Link>
            )}

            <Link href="/mock-tests" className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">⏱️</div>
              <div><h5 className="font-bold text-gray-800 group-hover:text-green-600">Take a Mock Test</h5><p className="text-xs text-gray-500">Test your knowledge with a quick quiz.</p></div>
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
}