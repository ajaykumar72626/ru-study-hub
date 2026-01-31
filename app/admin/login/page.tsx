"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Login successful, send them to the dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Failed to login. Are you authorized?");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Access</h1>
        <p className="text-gray-500 mb-8">Restricted Area. Authorized Personnel Only.</p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <span>🔐</span> Sign in with Google
        </button>

        <p className="mt-6 text-xs text-gray-400">
          Powered by Firebase Auth
        </p>
      </div>
    </div>
  );
}