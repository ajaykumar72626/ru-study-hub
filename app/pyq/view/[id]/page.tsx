import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  params: Promise<{ id: string }>;
};

type PyqData = {
  year: string;
  semester: string;
  subjectId: string;
  content: string;
  fileUrl?: string;
};

export default async function PyqViewerPage({ params }: Props) {
  const { id } = await params;

  // 1. Fetch the specific PYQ document
  const docRef = doc(db, "pyq", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">Document Not Found</h1>
        <Link href="/pyq" className="text-blue-600 hover:underline mt-4">
          Return to Archive
        </Link>
      </div>
    );
  }

  const data = docSnap.data() as PyqData;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/semester/${data.semester}/${data.subjectId}?view=pyq`}
              className="text-gray-500 hover:text-blue-600 font-medium text-sm"
            >
              ← Back
            </Link>
            <h1 className="text-lg font-bold text-gray-800 truncate">
              {data.year} Question Paper
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
                {data.subjectId}
              </span>
            </h1>
          </div>
          {/* Download Button (Optional - you can hide this if you want strict view-only) */}
          {data.fileUrl && (
            <a 
              href={data.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              download
              className="hidden sm:inline-block px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 transition-colors"
            >
              Download PDF
            </a>
          )}
        </div>
      </header>

      {/* Main Content Area with Ad Layout */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT AD SIDEBAR (Hidden on mobile) */}
        <aside className="hidden lg:block lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg h-[600px] flex items-center justify-center text-gray-400 text-sm p-4 text-center">
            Ad Space <br/> (Vertical Banner)
          </div>
        </aside>

        {/* CENTER: DOCUMENT VIEWER */}
        <section className="col-span-1 lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[80vh]">
          {data.fileUrl ? (
            // PDF Embed
            <iframe 
              src={data.fileUrl} 
              className="w-full h-screen lg:h-[800px]" 
              title="PDF Viewer"
            >
              <p>
                Your browser does not support PDFs. 
                <a href={data.fileUrl}>Download the PDF</a>.
              </p>
            </iframe>
          ) : (
            // Text Content Fallback
            <div className="p-8 prose max-w-none">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-sm text-yellow-700">
                This is a text-based version. No PDF file was attached.
              </div>
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
            </div>
          )}
        </section>

        {/* RIGHT AD SIDEBAR (Hidden on mobile) */}
        <aside className="hidden lg:block lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg h-[250px] flex items-center justify-center text-gray-400 text-sm p-4 text-center">
            Ad Space <br/> (Square)
          </div>
          <div className="bg-white border border-gray-200 rounded-lg h-[250px] flex items-center justify-center text-gray-400 text-sm p-4 text-center">
            Ad Space <br/> (Square)
          </div>
        </aside>

      </main>
    </div>
  );
}