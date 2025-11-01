"use client";

export default function Home() {



  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-[#1a1a1a] text-white flex flex-col">

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6">
          The Future of <span className="text-[#36C6E0]">Crypto Trading</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-10">
          Quantra combines cutting-edge AI analytics with lightning-fast execution to give you the edge in digital asset markets.
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <button
            onClick={() => setShowSignup(true)}
            className="px-8 py-3 bg-[#36C6E0] text-black font-semibold rounded-lg hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-[#36C6E0]/30 transition-all"
          >
            Start Trading
          </button>
          <a
            href="#learn"
            className="px-8 py-3 border border-gray-600 rounded-lg font-semibold hover:border-[#36C6E0] hover:text-[#36C6E0] hover:-translate-y-1 hover:scale-105 transition-all"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/10 text-sm text-gray-400 flex justify-between">
        <p>© {new Date().getFullYear()} Quantra. All rights reserved.</p>
        <div className="flex gap-4">
          {["Twitter", "LinkedIn", "GitHub"].map((s) => (
            <a key={s} href="#" className="hover:text-[#36C6E0] transition-colors">
              {s}
            </a>
          ))}
        </div>
      </footer>

      
    </div>
  );
}
