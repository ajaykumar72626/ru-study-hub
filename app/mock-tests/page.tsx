import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";

// Define the shape of a Test based on what we save in Admin Panel
type MockTest = {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  semester: string;
  subjectId: string;
  questionsCount: number;
};

// Next.js Server Component (Async)
export default async function MockTestsPage() {
  // 1. Fetch Tests from Firebase
  const testsRef = collection(db, "mock-tests");
  const q = query(testsRef); // You can add orderBy("createdAt", "desc") here later if you index it
  
  const querySnapshot = await getDocs(q);
  const tests: MockTest[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // Calculate question count by parsing the content JSON safely
    let qCount = 0;
    try {
        const questions = JSON.parse(data.content);
        qCount = questions.length;
    } catch (e) {
        qCount = 0; // If JSON is broken, show 0
    }

    tests.push({
      id: doc.id,
      title: data.title || "Untitled Test",
      duration: data.duration || "N/A",
      difficulty: data.difficulty || "Medium",
      semester: data.semester || "General",
      subjectId: data.subjectId || "General",
      questionsCount: qCount
    });
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section */}
      <div className="bg-blue-700 text-white py-12 px-4 text-center shadow-md">
        <h1 className="text-3xl font-bold mb-2">Practice & Mock Tests</h1>
        <p className="text-blue-100 max-w-2xl mx-auto">
          Sharpen your skills with our curated MCQ sets. Created by faculty and seniors.
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10 w-full flex-grow">
        
        {tests.length === 0 ? (
             <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-700">No mock tests available yet.</h3>
                <p className="text-sm text-gray-500 mt-2">Check back later or ask Admin to upload one.</p>
                <Link href="/admin/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
                  Go to Admin Panel
                </Link>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => (
                <div 
                key={test.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
                >
                <div className="flex justify-between items-start mb-4">
                    <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {test.title}
                    </h3>
                    <div className="flex gap-2 mt-2">
                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                            Sem {test.semester}
                        </span>
                        <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 uppercase">
                            {test.subjectId}
                        </span>
                    </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                    test.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                    }`}>
                    {test.difficulty}
                    </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-1">
                    <span>❓</span> {test.questionsCount} Questions
                    </div>
                    <div className="flex items-center gap-1">
                    <span>⏱️</span> {test.duration}
                    </div>
                </div>

                <Link 
                    href={`/mock-tests/${test.id}`}
                    className="block w-full text-center bg-white text-blue-600 border border-blue-600 font-bold py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                >
                    Start Test Now
                </Link>
                </div>
            ))}
            </div>
        )}

      </main>
    </div>
  );
}