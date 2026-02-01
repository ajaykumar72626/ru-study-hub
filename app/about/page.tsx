import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | RU Study Hub",
  description: "Learn about the mission behind RU Study Hub - A student-led initiative for Ranchi University BCA resources.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-blue-700 text-white py-16 px-4 text-center shadow-md">
        <h1 className="text-4xl font-bold mb-4">About RU Study Hub</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">
          Bridging the gap between syllabus and success for Ranchi University students.
        </p>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 w-full flex-grow space-y-12">
        
        {/* Mission Section */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">🚀</span> Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            RU Study Hub started with a simple observation: <strong>Syllabus books are heavy, but searching for notes shouldn't be.</strong>
            <br /><br />
            As BCA students at Ranchi University (Gossner College), we realized that finding specific, exam-oriented notes for our curriculum was a challenge. Most websites cover general programming, but not the <em>specific</em> questions asked in our semester exams.
            <br /><br />
            Our mission is to digitize the entire RU BCA curriculum—Notes, PYQs, and Mock Tests—into one free, accessible platform for every student.
          </p>
        </section>

        {/* Features Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-blue-50 hover:shadow-md transition-shadow text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-800 mb-2">Curriculum Specific</h3>
              <p className="text-sm text-gray-500">We don't copy-paste form Wikipedia. Every note is tailored to the RU CBCS Syllabus.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-blue-50 hover:shadow-md transition-shadow text-center">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-bold text-gray-800 mb-2">Mobile First</h3>
              <p className="text-sm text-gray-500">Read on the bus, in the canteen, or 10 minutes before the exam. Fast and responsive.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-blue-50 hover:shadow-md transition-shadow text-center">
              <div className="text-4xl mb-3">💸</div>
              <h3 className="font-bold text-gray-800 mb-2">100% Free</h3>
              <p className="text-sm text-gray-500">Education should be accessible. No paywalls for reading notes or viewing papers.</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 text-center">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Developed by Students</h2>
          <p className="text-gray-600 mb-6">
            Designed and Maintained by <strong>Ajay Kumar</strong>.
          </p>
          <div className="flex justify-center gap-4">
            {/* Functional Mailto Link */}
            <a href="mailto:ajaykumar72626@gmail.com" className="px-6 py-2 bg-white text-blue-700 border border-blue-200 rounded-full font-semibold hover:bg-blue-50 transition-colors">
              Contact Developer
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}