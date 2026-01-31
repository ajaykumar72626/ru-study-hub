import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/app/lib/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";

type Props = {
  params: Promise<{ id: string; subjectId: string }>;
  searchParams: Promise<{ view?: string }>;
};

type Note = {
  id: string;
  unitTitle: string;
  content: string;
  author: string;
};

export default async function SubjectPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { id, subjectId } = resolvedParams;
  // Default to 'notes' if no view is selected
  const activeTab = resolvedSearchParams.view || "notes";

  // 1. Fetch Notes from Firebase
  const notesRef = collection(db, "notes");
  const q = query(
    notesRef, 
    where("semester", "==", id),
    where("subjectId", "==", subjectId)
  );
  
  const querySnapshot = await getDocs(q);
  const notes: Note[] = [];
  
  querySnapshot.forEach((doc) => {
    notes.push({ id: doc.id, ...doc.data() } as Note);
  });

  // Sort notes alphabetically
  notes.sort((a, b) => a.unitTitle.localeCompare(b.unitTitle));

  const subjectName = subjectId.replace(/-/g, " ").toUpperCase();

  // Helper function for Tab Styles
  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return isActive
      ? "px-4 py-2 border-b-2 border-blue-600 text-blue-700 font-bold whitespace-nowrap"
      : "px-4 py-2 text-gray-500 hover:text-gray-800 whitespace-nowrap";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            href={`/semester/${id}`}
            className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
          >
            ← Back to Sem {id}
          </Link>
          <h1 className="text-lg font-bold text-gray-800 truncate">
            {subjectName}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 w-full">
        {/* --- TABS --- */}
        <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto">
          {/* We use Link to switch tabs by changing the URL parameter */}
          <Link href={`?view=notes`} className={getTabClass("notes")}>
            Notes ({notes.length})
          </Link>
          <Link href={`?view=syllabus`} className={getTabClass("syllabus")}>
            Syllabus
          </Link>
          <Link href={`?view=pyq`} className={getTabClass("pyq")}>
            PYQs
          </Link>
        </div>

        {/* --- DYNAMIC CONTENT AREA --- */}
        <div className="space-y-6">
          
          {/* VIEW: NOTES */}
          {activeTab === "notes" && (
            <>
              {notes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No notes uploaded yet.</p>
                  <Link href="/admin/dashboard" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
                    Add one now?
                  </Link>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-2">
                      <h2 className="text-xl font-bold text-gray-800">{note.unitTitle}</h2>
                      <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">
                        Verified
                      </span>
                    </div>
                    <div 
                      className="prose max-w-none text-gray-600"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                  </div>
                ))
              )}
            </>
          )}

          {/* VIEW: SYLLABUS */}
          {activeTab === "syllabus" && (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <h3 className="text-lg font-semibold text-gray-700">📜 Syllabus Section</h3>
              <p className="text-gray-500 mt-2">
                The official syllabus breakdown will appear here.
              </p>
              <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-sm rounded inline-block">
                Feature coming in Phase 3
              </div>
            </div>
          )}

          {/* VIEW: PYQ */}
          {activeTab === "pyq" && (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <h3 className="text-lg font-semibold text-gray-700">📝 Previous Year Questions</h3>
              <p className="text-gray-500 mt-2">
                2022, 2023, and 2024 Question Papers will be uploaded here.
              </p>
              <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-sm rounded inline-block">
                Feature coming in Phase 3
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}