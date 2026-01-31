"use client";

import { useEffect, useState } from "react";
// Import 'db' to access the database
import { auth, db } from "../../lib/firebase"; 
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
// Import Firestore functions to save data
import { collection, addDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- FORM STATE ---
  // These variables store what you type in the boxes
  const [semester, setSemester] = useState("6");
  const [subjectId, setSubjectId] = useState("");
  const [unitTitle, setUnitTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(""); // To show "Saving..." or "Success!"

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  // --- THE SAVE FUNCTION ---
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop page from reloading
    setStatus("Saving...");

    try {
      // 1. Tell Firebase to go to the "notes" collection
      // 2. Add this new document
      await addDoc(collection(db, "notes"), {
        semester: semester,
        subjectId: subjectId.toLowerCase().trim(), // Ensure 'AI' becomes 'ai'
        unitTitle: unitTitle,
        content: content,
        createdAt: new Date(),
        author: user?.email,
      });

      setStatus("✅ Note Saved Successfully!");
      // Clear the form
      setUnitTitle("");
      setContent("");
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus("❌ Error saving note. Check console.");
    }
  };

  if (loading) return <div className="p-10">Loading access...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="font-bold text-xl text-blue-700">Admin Panel</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:inline">
             {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 max-w-3xl mx-auto mt-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">✍️ Add New Note</h2>
          
          <form onSubmit={handleSaveNote} className="space-y-4">
            
            {/* Row 1: Semester & Subject */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select 
                  value={semester} 
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">Sem 1</option>
                  <option value="2">Sem 2</option>
                  <option value="3">Sem 3</option>
                  <option value="4">Sem 4</option>
                  <option value="5">Sem 5</option>
                  <option value="6">Sem 6</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject ID (e.g. 'ai', 'java')</label>
                <input
                  type="text"
                  required
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  placeholder="ai"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            </div>

            {/* Row 2: Unit Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Title</label>
              <input
                type="text"
                required
                value={unitTitle}
                onChange={(e) => setUnitTitle(e.target.value)}
                placeholder="Unit 1: Introduction to Artificial Intelligence"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Row 3: Content Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note Content (HTML or Text)</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="Type your notes here... Use <p> for paragraphs or <b> for bold."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Tip: You can paste HTML here for formatting.</p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md active:scale-95"
              >
                💾 Save Note to Database
              </button>
            </div>

            {/* Status Message */}
            {status && (
              <div className={`text-center p-3 rounded-md text-sm font-medium ${status.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                {status}
              </div>
            )}

          </form>
        </div>
      </main>
    </div>
  );
}