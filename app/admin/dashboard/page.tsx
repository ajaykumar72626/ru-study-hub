"use client";

import { useEffect, useState, useCallback } from "react";
import { auth, db, storage } from "../../lib/firebase"; 
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc 
} from "firebase/firestore";
// CHANGED: Use standard uploadBytes instead of Resumable for better stability
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- OFFICIAL RANCHI UNIVERSITY SYLLABUS MAPPING ---
const SEMESTER_SUBJECTS: Record<string, { id: string; name: string }[]> = {
  "1": [
    { id: "c1", name: "C1: Programming Fundamentals using C/C++" },
    { id: "c2", name: "C2: Computer System Architecture" },
    { id: "aecc1", name: "AECC: English/Hindi Communication" },
    { id: "ge1a", name: "GE 1A: Mathematics" },
    { id: "ge1b", name: "GE 1B: Physics" }
  ],
  "2": [
    { id: "c3", name: "C3: Programming in JAVA" },
    { id: "c4", name: "C4: Discrete Structures" },
    { id: "aecc2", name: "AECC: Environmental Studies (EVS)" },
    { id: "ge2a", name: "GE 2A: Mathematics" },
    { id: "ge2b", name: "GE 2B: Physics" }
  ],
  "3": [
    { id: "c5", name: "C5: Data Structures" },
    { id: "c6", name: "C6: Operating Systems" },
    { id: "c7", name: "C7: Computer Networks" },
    { id: "sec1", name: "SEC 1: Elem. Computer App Softwares" },
    { id: "ge3a", name: "GE 3A: Mathematics" },
    { id: "ge3b", name: "GE 3B: Physics" }
  ],
  "4": [
    { id: "c8", name: "C8: Design and Analysis of Algorithms" },
    { id: "c9", name: "C9: Software Engineering Theory" },
    { id: "c10", name: "C10: Database Management Systems" },
    { id: "sec2", name: "SEC 2: HTML & PHP Programming" },
    { id: "ge4a", name: "GE 4A: Mathematics" },
    { id: "ge4b", name: "GE 4B: Physics" }
  ],
  "5": [
    { id: "c11", name: "C11: Internet Technologies" },
    { id: "c12", name: "C12: Theory of Computation" },
    { id: "dse1", name: "DSE 1: Information Security" },
    { id: "dse2", name: "DSE 2: Cloud Computing" }
  ],
  "6": [
    { id: "c13", name: "C13: Artificial Intelligence" },
    { id: "c14", name: "C14: Computer Graphics" },
    { id: "dse3", name: "DSE 3: Numerical Methods" },
    { id: "dse4", name: "DSE 4: OJT & Project Work" }
  ]
};

// Types for our data
type ContentItem = {
  id: string;
  semester: string;
  subjectId: string;
  content: string;
  unitTitle?: string; 
  year?: string;      
  fileUrl?: string; 
  title?: string;
  duration?: string;
  difficulty?: string;
  updatedAt?: any;
};

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- FORM STATE ---
  const [contentType, setContentType] = useState<"syllabus" | "note" | "pyq" | "mock-test">("syllabus");
  const [semester, setSemester] = useState("6");
  const [subjectId, setSubjectId] = useState("");
  
  // Specific Fields
  const [unitTitle, setUnitTitle] = useState(""); 
  const [year, setYear] = useState(""); 
  const [testTitle, setTestTitle] = useState("");
  const [duration, setDuration] = useState("15 Mins");
  const [difficulty, setDifficulty] = useState("Medium");

  const [content, setContent] = useState("");
  
  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  // --- DATA LIST STATE ---
  const [existingData, setExistingData] = useState<ContentItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/admin/login");
      else setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      let collectionName = "syllabus";
      if (contentType === "note") collectionName = "notes";
      if (contentType === "pyq") collectionName = "pyq";
      if (contentType === "mock-test") collectionName = "mock-tests";
      
      const q = query(
        collection(db, collectionName), 
        where("semester", "==", semester)
      );
      
      const snapshot = await getDocs(q);
      let items: ContentItem[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as ContentItem);
      });

      if (subjectId) {
         items = items.filter(item => item.subjectId === subjectId);
      }

      if (contentType === "note") {
        items.sort((a, b) => (a.unitTitle || "").localeCompare(b.unitTitle || ""));
      } else if (contentType === "pyq") {
        items.sort((a, b) => (b.year || "").localeCompare(a.year || ""));
      } else if (contentType === "mock-test") {
        items.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      }
      setExistingData(items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsFetching(false);
  }, [semester, subjectId, contentType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const handleEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setSubjectId(item.subjectId); 
    setContent(item.content);
    
    if (contentType === "note" && item.unitTitle) setUnitTitle(item.unitTitle);
    if (contentType === "pyq" && item.year) setYear(item.year);
    if (contentType === "mock-test") {
        setTestTitle(item.title || "");
        setDuration(item.duration || "15 Mins");
        setDifficulty(item.difficulty || "Medium");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatus("✏️ Editing mode active");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this permanently?")) return;
    try {
      let collectionName = "syllabus";
      if (contentType === "note") collectionName = "notes";
      if (contentType === "pyq") collectionName = "pyq";
      if (contentType === "mock-test") collectionName = "mock-tests";

      await deleteDoc(doc(db, collectionName, id));
      setExistingData(prev => prev.filter(item => item.id !== id));
      setStatus("🗑️ Item deleted.");
    } catch (error) {
      console.error(error);
      setStatus("❌ Delete failed.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) {
        setStatus("⚠️ Please select a subject first.");
        return;
    }

    if (contentType === "mock-test") {
        try {
            JSON.parse(content); 
        } catch (e) {
            setStatus("❌ Invalid JSON format for Questions.");
            return;
        }
    }

    setStatus("Starting process...");
    setIsUploading(true);

    let collectionName = "syllabus";
    if (contentType === "note") collectionName = "notes";
    if (contentType === "pyq") collectionName = "pyq";
    if (contentType === "mock-test") collectionName = "mock-tests";

    try {
      let fileUrl = "";

      // --- ROBUST FILE UPLOAD (Standard uploadBytes) ---
      if (file) {
        // 1. Simple Size Check
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
             setStatus("❌ File too large (>10MB).");
             setIsUploading(false);
             return;
        }

        const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const storagePath = `uploads/${contentType}/${uniqueName}`;
        const storageRef = ref(storage, storagePath);
        
        try {
            setStatus("Uploading File... (Please wait)");
            
            // Direct Upload - No progress bar, but more reliable
            const snapshot = await uploadBytes(storageRef, file);
            
            setStatus("Upload complete. Getting URL...");
            fileUrl = await getDownloadURL(snapshot.ref);
            console.log("File available at:", fileUrl);
        } catch (storageError: any) {
            console.error("Storage Error:", storageError);
            if (storageError.message.includes("cors") || storageError.code === "storage/unauthorized") {
                setStatus("❌ Upload Failed: Check CORS/Rules in Console.");
            } else {
                setStatus(`❌ Upload Error: ${storageError.message}`);
            }
            setIsUploading(false);
            return; 
        }
      }

      setStatus("Saving metadata to Database...");
      const payload: any = {
        semester,
        subjectId: subjectId,
        content,
        updatedAt: new Date(),
        author: user?.email,
      };

      if (fileUrl) payload.fileUrl = fileUrl;
      if (contentType === "note") payload.unitTitle = unitTitle;
      if (contentType === "pyq") payload.year = year;
      if (contentType === "mock-test") {
          payload.title = testTitle;
          payload.duration = duration;
          payload.difficulty = difficulty;
      }

      if (editingId) {
        const docRef = doc(db, collectionName, editingId);
        await updateDoc(docRef, payload);
        setStatus("✅ Updated Successfully!");
      } else {
        if (contentType === "syllabus" && existingData.length > 0) {
           if(!confirm("A syllabus might already exist. Create another one?")) {
             setStatus("⚠️ Cancelled.");
             setIsUploading(false);
             return;
           }
        }
        await addDoc(collection(db, collectionName), { ...payload, createdAt: new Date() });
        setStatus("✅ Saved Successfully!");
      }

      setEditingId(null);
      setContent("");
      setUnitTitle("");
      setYear("");
      setTestTitle("");
      setFile(null); 
      fetchData(); 
    } catch (error: any) {
      console.error("Save Error:", error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setContent("");
    setUnitTitle("");
    setYear("");
    setTestTitle("");
    setFile(null);
    setStatus("");
  };

  const activeSubjects = SEMESTER_SUBJECTS[semester] || [];

  if (loading) return <div className="p-10 text-center">Loading access...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="font-bold text-xl text-blue-700">Admin Panel</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:inline">{user?.email}</span>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded">Logout</button>
        </div>
      </nav>

      <main className="p-4 max-w-6xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- LEFT COLUMN: EDITOR --- */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex flex-col gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "✏️ Edit Content" : "➕ Add New Content"}
              </h2>
              {/* Type Toggle */}
              <div className="bg-gray-100 p-1 rounded-lg flex flex-wrap gap-1 justify-between">
                {["syllabus", "note", "pyq", "mock-test"].map((type) => (
                    <button 
                        key={type}
                        onClick={() => { setContentType(type as any); setEditingId(null); }}
                        className={`flex-1 px-2 py-1.5 rounded text-xs font-bold uppercase transition-all ${contentType === type ? "bg-white shadow text-blue-700" : "text-gray-500"}`}
                    >
                        {type.replace("-", " ")}
                    </button>
                ))}
              </div>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Semester</label>
                  <select 
                    value={semester} 
                    onChange={(e) => {
                        setSemester(e.target.value);
                        setSubjectId(""); 
                    }} 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>Sem {num}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Subject</label>
                  <select 
                    value={subjectId} 
                    onChange={(e) => setSubjectId(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- All Subjects --</option>
                    {activeSubjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                            {sub.name}
                        </option>
                    ))}
                  </select>
                </div>
              </div>

              {contentType === "note" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Unit Title</label>
                  <input type="text" value={unitTitle} onChange={(e) => setUnitTitle(e.target.value)} placeholder="Unit 1: Introduction" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              {contentType === "pyq" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Exam Year</label>
                  <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2023" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              {contentType === "mock-test" && (
                <>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Test Title</label>
                        <input type="text" value={testTitle} onChange={(e) => setTestTitle(e.target.value)} placeholder="Computer Fundamentals Quiz" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Duration</label>
                            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="15 Mins" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Difficulty</label>
                            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>
                </>
              )}

              {(contentType === "note" || contentType === "pyq") && (
                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                  <label className="block text-xs font-bold text-blue-700 mb-1 uppercase">
                    📎 Upload File (PDF / Image)
                  </label>
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                  />
                  <p className="text-xs text-gray-400 mt-1">Optional. If uploading a PDF, you can leave the HTML content below empty.</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex justify-between">
                  {contentType === 'pyq' ? "Notes / Description" : contentType === 'mock-test' ? "Questions (JSON)" : "HTML Content"}
                  {contentType === 'mock-test' && <span className="text-blue-500 cursor-pointer" onClick={() => setContent(`[\n  {\n    "id": 1,\n    "question": "Sample Question?",\n    "options": ["Option A", "Option B", "Option C", "Option D"],\n    "answer": 0\n  }\n]`)}>[Load Sample]</span>}
                </label>
                <textarea 
                  required={!file && contentType !== 'mock-test'}
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  rows={10} 
                  className="w-full p-2 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className={`flex-1 text-white font-bold py-2 rounded shadow-md transition-all ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {isUploading ? "Uploading..." : editingId ? "Update Changes" : "Save to Database"}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300">
                    Cancel
                  </button>
                )}
              </div>

              {status && (
                <div className={`text-center p-2 rounded text-sm font-medium ${status.includes("Error") || status.includes("Delete") || status.includes("Please") || status.includes("Cancelled") || status.includes("Invalid") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* --- RIGHT COLUMN: LIST --- */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase">
                {contentType.toUpperCase().replace("-", " ")} LIST
              </h3>
              <button onClick={fetchData} className="text-xs text-blue-600 hover:underline">Refresh</button>
            </div>

            {isFetching ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : existingData.length === 0 ? (
              <p className="text-sm text-gray-400">No content found.</p>
            ) : (
              <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {existingData.map((item) => (
                  <li key={item.id} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded hover:border-blue-200 transition-all">
                    <div className="overflow-hidden">
                      <div className="font-semibold text-sm text-gray-800 truncate flex items-center gap-2">
                        {item.fileUrl && <span title="Has PDF/File">📎</span>}
                        {contentType === 'note' ? item.unitTitle : contentType === 'pyq' ? `Year: ${item.year}` : contentType === 'mock-test' ? item.title : 'Syllabus'}
                      </div>
                      <p className="text-xs text-gray-500 font-mono">
                        ID: {item.subjectId}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-100 hover:bg-blue-100 text-xs font-bold" 
                      >
                        EDIT
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="px-2 py-1 bg-red-50 text-red-600 rounded border border-red-100 hover:bg-red-100 text-xs font-bold" 
                      >
                        DEL
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}