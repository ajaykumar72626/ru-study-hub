"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

type TestData = {
  title: string;
  content: string; // This is the JSON string
};

export default function QuizPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [testInfo, setTestInfo] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const docRef = doc(db, "mock-tests", testId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as TestData;
          setTestInfo(data);
          const parsedQuestions = JSON.parse(data.content);
          setQuestions(parsedQuestions);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your test...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800">Test Not Ready</h1>
        <p className="text-gray-500 mb-6">This test might be empty or in a wrong format.</p>
        <Link href="/mock-tests" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">
            Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-6 flex justify-between items-center">
           <Link href="/mock-tests" className="text-sm text-gray-500 hover:text-blue-600 font-medium flex items-center gap-1">
             ← Exit Quiz
           </Link>
           <div className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full uppercase truncate max-w-[200px]">
             {testInfo?.title}
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          {showScore ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Results</h2>
              <p className="text-gray-500 mb-6 font-medium">
                You correctly answered <span className="text-blue-700">{score}</span> out of {questions.length} questions.
              </p>
              
              <div className="w-full bg-gray-100 rounded-full h-4 mb-8">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-1000" 
                  style={{ width: `${(score / questions.length) * 100}%` }}
                ></div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => { setShowScore(false); setCurrentQuestion(0); setScore(0); setSelectedOption(null); }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
                <Link href="/mock-tests" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  Choose Another Test
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-blue-600">Question {currentQuestion + 1} of {questions.length}</span>
                    <span className="text-xs text-gray-400">Time: Unlimited</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full">
                    <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all" 
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
              </div>

              <p className="text-xl text-gray-800 mb-8 leading-relaxed font-semibold">
                {questions[currentQuestion].question}
              </p>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                      selectedOption === index 
                        ? "border-blue-500 bg-blue-50 text-blue-900 shadow-sm" 
                        : "border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === index ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                        {selectedOption === index && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedOption === null}
                  className={`px-10 py-3 rounded-xl font-bold transition-all ${
                    selectedOption === null
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                  }`}
                >
                  {currentQuestion + 1 === questions.length ? "Submit Test" : "Next Question"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}