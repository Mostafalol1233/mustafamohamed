import { useEffect } from "react";

export default function ResumePage() {
  useEffect(() => {
    document.title = "Mustafa Mohamed — Resume";
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f0] flex flex-col items-center py-10 px-4 print:p-0 print:bg-white">
      {/* Print button — hidden when printing */}
      <div className="mb-6 flex gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Download / Print PDF
        </button>
        <a
          href="/"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-400 transition-colors"
        >
          ← Back to Portfolio
        </a>
      </div>

      {/* Resume sheet */}
      <div
        className="w-full max-w-[820px] bg-white shadow-xl print:shadow-none print:max-w-none"
        style={{ minHeight: "1056px", fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
      >
        {/* Header */}
        <div className="px-12 pt-12 pb-8 border-b border-gray-200 print:px-10 print:pt-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Mustafa Mohamed</h1>
              <p className="text-lg text-blue-600 font-medium mt-1">Full-Stack Developer · Open Source Author</p>
            </div>
            <div className="text-right text-sm text-gray-500 leading-relaxed shrink-0">
              <div className="flex items-center justify-end gap-1.5">
                <span>Cairo, Egypt · Remote-friendly</span>
              </div>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span>contact@crossfire.wiki</span>
              </div>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span>+20 150 030 2461</span>
              </div>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <a href="https://linkedin.com/in/mustafa-bemo" className="text-blue-600 hover:underline">linkedin.com/in/mustafa-bemo</a>
              </div>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <a href="https://github.com/Bemora" className="text-blue-600 hover:underline">github.com/Bemora</a>
              </div>
            </div>
          </div>

          {/* Summary */}
          <p className="mt-6 text-sm text-gray-600 leading-relaxed max-w-2xl">
            Full-stack developer with 4+ years of experience building production-ready web applications,
            open-source tools, and game projects. Specialized in JavaScript / TypeScript ecosystems —
            React, Node.js, and Supabase — with additional experience in Python automation, C++ systems,
            and Godot game development. Creator of <strong>Bemora</strong>, a published npm package exposing
            94+ API integrations for developers.
          </p>
        </div>

        <div className="px-12 py-8 grid grid-cols-[1fr_220px] gap-10 print:px-10 print:gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">

            {/* Experience */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 pb-1.5 border-b border-gray-100">
                Experience
              </h2>
              <div className="space-y-6">

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Full-Stack Developer</h3>
                      <p className="text-sm text-blue-600">Freelance / Self-Employed</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 mt-1">2020 — Present</span>
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-sm text-gray-600 list-none">
                    <li className="flex gap-2"><span className="text-blue-500 mt-0.5">▸</span>Designed and shipped 15+ client projects including e-commerce platforms, SaaS dashboards, gaming sites, and automation tools.</li>
                    <li className="flex gap-2"><span className="text-blue-500 mt-0.5">▸</span>Built and maintains <span className="font-semibold">Bemora</span> — an open-source npm package providing a unified interface to 94+ public APIs (weather, crypto, AI, gaming, and more).</li>
                    <li className="flex gap-2"><span className="text-blue-500 mt-0.5">▸</span>Developed bilingual (Arabic / English) web applications serving MENA-region clients, with RTL layout support and i18n architecture.</li>
                    <li className="flex gap-2"><span className="text-blue-500 mt-0.5">▸</span>Integrated Supabase backends (PostgreSQL, Auth, Storage) for real-time data, row-level security, and file management.</li>
                    <li className="flex gap-2"><span className="text-blue-500 mt-0.5">▸</span>Created Discord and Telegram bots with custom command systems, automation workflows, and third-party API hooks.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Game Developer</h3>
                      <p className="text-sm text-blue-600">Independent — Godot Engine</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 mt-1">2021 — Present</span>
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-sm text-gray-600">
                    <li className="flex gap-2"><span className="text-blue-500 mt-0.5">▸</span>Developed 2D and multiplayer game projects using Godot Engine (GDScript / C++) with custom physics and UI systems.</li>
                    <li className="flex gap-2"><span className="text-blue-500 mt-0.5">▸</span>Built web-connected game backends integrating leaderboards, player auth, and real-time data sync.</li>
                  </ul>
                </div>

              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 pb-1.5 border-b border-gray-100">
                Selected Projects
              </h2>
              <div className="space-y-4">

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Bemora</h3>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">npm package</span>
                    <a href="https://npmjs.com/package/bemora" className="text-xs text-gray-400 hover:text-blue-500 ml-auto">npmjs.com/package/bemora</a>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Open-source developer toolkit exposing 94+ API integrations — crypto prices, weather, AI models, gaming stats — through a single unified interface. Published on npm with TypeScript types included.</p>
                  <p className="text-xs text-gray-400 mt-1">TypeScript · Node.js · REST APIs · npm</p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">E-commerce Platform</h3>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">client work</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Full-stack online store with product management, cart, checkout, and admin panel. Built with React, Node.js, and Supabase with real-time inventory updates.</p>
                  <p className="text-xs text-gray-400 mt-1">React · TypeScript · Supabase · Node.js</p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Online Academy Platform</h3>
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">client work</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Learning management system with course enrollment, video lessons, progress tracking, and bilingual UI (Arabic/English) for MENA-market education clients.</p>
                  <p className="text-xs text-gray-400 mt-1">React · Supabase · i18n · RTL</p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Discord / Telegram Bots</h3>
                    <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">automation</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Multiple production bots with command systems, moderation, crypto/weather alerts, and API-driven responses. Deployed on VPS with 24/7 uptime.</p>
                  <p className="text-xs text-gray-400 mt-1">Python · Node.js · Discord.js · Telegram Bot API</p>
                </div>

              </div>
            </section>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-7">

            {/* Skills */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1.5 border-b border-gray-100">
                Technical Skills
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-1.5">Frontend</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["React", "TypeScript", "Tailwind CSS", "Vite", "HTML5", "CSS3"].map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-1.5">Backend</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Node.js", "Express", "Supabase", "PostgreSQL", "REST APIs"].map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-1.5">Languages</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["JavaScript", "TypeScript", "Python", "C++", "Ruby", "GDScript"].map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-1.5">Tools & Platforms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Git", "GitHub", "Godot", "npm", "Vercel", "Linux", "VS Code"].map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Open Source */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1.5 border-b border-gray-100">
                Open Source
              </h2>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">▸</span>
                  <span><strong>Bemora</strong> — npm package, 94+ API integrations, MIT licensed</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">▸</span>
                  <span>Active GitHub profile with public repositories across web, game, and automation projects</span>
                </div>
              </div>
            </section>

            {/* Languages */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1.5 border-b border-gray-100">
                Languages
              </h2>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex justify-between"><span>Arabic</span><span className="text-gray-400">Native</span></div>
                <div className="flex justify-between"><span>English</span><span className="text-gray-400">Professional</span></div>
              </div>
            </section>

            {/* Links */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1.5 border-b border-gray-100">
                Links
              </h2>
              <div className="space-y-1.5 text-sm">
                <div><a href="https://github.com/Bemora" className="text-blue-600 hover:underline">GitHub</a></div>
                <div><a href="https://linkedin.com/in/mustafa-bemo" className="text-blue-600 hover:underline">LinkedIn</a></div>
                <div><a href="https://npmjs.com/package/bemora" className="text-blue-600 hover:underline">npm Package</a></div>
                <div><a href="https://x.com/Bemora_BEMO" className="text-blue-600 hover:underline">X / Twitter</a></div>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
