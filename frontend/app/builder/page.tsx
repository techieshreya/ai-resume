"use client";
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import ResumeForm from '@/components/ResumeForm';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import WorkflowsTab, { PipelineConfig } from '@/components/WorkflowsTab';

const API_URL = "https://ai-resume-production-564b.up.railway.app";

export default function BuilderPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  // ================= STATE =================
  const [showSidebar, setShowSidebar] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // Overleaf-style PDF toggle

  // App Data State
  const [username, setUsername] = useState("techieshreya");
  const [profileData, setProfileData] = useState<any>(null);
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [typstCode, setTypstCode] = useState("// Loading...");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");

  // Pipeline State
  const [activePipeline, setActivePipeline] = useState<PipelineConfig | null>(null);

  // ================= AUTH CHECK =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (!res.ok) throw new Error("Invalid token"); return res.json(); })
      .then(() => setAuthenticated(true))
      .catch(() => { localStorage.removeItem("token"); localStorage.removeItem("user"); router.push("/login"); });
  }, [router]);

  // ================= HANDLERS =================
  const handleInitialLoad = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/profile/${username}`);
      setProfileData(res.data);
      await handleCompile(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("User not found on GitHub. Using empty template.");
      const emptyData = { full_name: username, github_username: username, email: "", bio: "", projects: [] };
      setProfileData(emptyData);
      handleCompile(emptyData);
    }
    setLoading(false);
  };

  const handleCompile = async (dataToUse = profileData, pipeline: PipelineConfig | null = activePipeline) => {
    if (!dataToUse) return;
    try {
      const payload = { username, profile_data: dataToUse, jd_text: jdText, pipeline: pipeline };
      const res = await axios.post(`${API_URL}/generate`, payload);
      setTypstCode(res.data.typst_code);
      setPdfUrl(`${API_URL}/static/resume.pdf?t=${Date.now()}`);
      if (res.data.analysis) setAnalysis(res.data.analysis);
    } catch (e) {
      console.error("Compile failed", e);
      alert("Compilation failed. Check backend console.");
    }
  };

  const handleRunPipeline = (config: PipelineConfig) => {
    setActivePipeline(config);
    setShowPreview(true); // Auto-open preview when running an agent
    handleCompile(profileData, config);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!authenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B1120] text-teal-400">
        <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="bg-[#F0F2F5] dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 font-sans h-screen flex overflow-hidden selection:bg-teal-400 selection:text-navy-900">

      {/* ====== SIDEBAR ====== */}
      <aside
        className={`w-20 lg:w-64 flex flex-col border-r border-white/20 dark:border-white/5 glass-sidebar flex-shrink-0 z-30 transition-all duration-300
          ${!showSidebar || isFocusMode ? '-ml-20 lg:-ml-64' : ''}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 lg:px-6 border-b border-gray-100/50 dark:border-white/5">
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 dark:from-teal-400 dark:to-teal-600 text-white dark:text-navy-900 p-2 rounded-xl mr-3 shadow-lg shadow-teal-900/10">
            <span className="material-symbols-outlined text-xl">stylus_note</span>
          </div>
          <div className="hidden lg:block relative group cursor-pointer" onClick={() => router.push('/')}>
            <h1 className="font-serif font-bold text-xl text-navy-900 dark:text-white leading-tight tracking-tight">
              Atelier<span className="text-teal-500">.ai</span>
            </h1>
            <p className="text-[9px] text-gray-500 font-bold tracking-[0.2em] uppercase">Bespoke CVs</p>
          </div>
        </div>

        {/* Workspace */}
        <div className="p-4 lg:p-6 flex-1 overflow-y-auto">
          <div className="mb-8 hidden lg:block">
            <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 font-sans">Workspace</h3>
            <div className="relative group mb-4">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </span>
              <input
                className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition-all shadow-sm placeholder:text-gray-400"
                placeholder="Profile Name"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button
              onClick={handleInitialLoad}
              disabled={loading}
              className="w-full bg-navy-900 hover:bg-navy-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-navy-900 font-semibold py-3 px-4 rounded-xl flex items-center justify-center transition-all shadow-boutique hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">
                {loading ? 'progress_activity' : 'auto_fix_high'}
              </span>
              <span>{loading ? 'Loading...' : 'Generate Profile'}</span>
            </button>
          </div>

          {/* Nav Tabs */}
          <nav className="space-y-1">
            {[
              { id: 'editor', icon: 'edit_square', label: 'Editor', activeClass: 'bg-teal-50/50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' },
              { id: 'job', icon: 'target', label: 'Job Match', activeClass: 'bg-purple-50/50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' },
              { id: 'workflows', icon: 'smart_toy', label: 'Agents', activeClass: 'bg-amber-50/50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' },
              { id: 'code', icon: 'code', label: 'Code', activeClass: 'bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' },
              { id: 'templates', icon: 'style', label: 'Templates', activeClass: 'bg-rose-50/50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300' },
              { id: 'settings', icon: 'settings', label: 'Settings', activeClass: 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-900 dark:text-white' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-3 rounded-xl group transition-all
                  ${activeTab === tab.id ? tab.activeClass : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-navy-900 dark:hover:text-white'}
                `}
              >
                <span className="material-symbols-outlined text-[22px] lg:mr-3 group-hover:scale-110 transition-transform">{tab.icon}</span>
                <span className="hidden lg:block font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100/50 dark:border-white/5">
          <div className="flex items-center justify-center lg:justify-between p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors group relative">
            <div className="flex items-center">
              <img alt="Avatar" className="h-9 w-9 rounded-full ring-2 ring-white dark:ring-navy-800 shadow-md lg:mr-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8Sxeod68zTs9ew1UELPFVcXMRfwR7YlKj9gTGpnAfQcMasce2PU6TpLC7GzFi4x5c6rsFRG4E91ikcfS6LQtMqxZwM9q4jnRTQgpZJODVdbrXS7TvPq27CluOiJCuu6hMWq2l_6fYzUaiTTpkHvOHx7Y25_f30ertn27cXpToOETnNPq-NrDoIfC0JWH26GobsFCfRkpx4_RVhJ5GDofq7MVCbhrzPLxxhRm0sK6VkmwsLFBNEz83tOmohwYRQPT7zm19zGWpdrI" />
              <div className="hidden lg:block min-w-0">
                <p className="text-sm font-bold text-navy-900 dark:text-white truncate">Techie Shreya</p>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">Pro Plan Active</p>
              </div>
            </div>
            <button onClick={handleLogout} className="hidden lg:flex p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Sign Out">
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ====== MAIN CONTENT ====== */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#F0F2F5] dark:bg-[#0B1120] relative max-w-full">

        {/* ====== HEADER TOOLBAR (Overleaf-style) ====== */}
        <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200/80 dark:border-white/5 bg-white/80 dark:bg-[#0d1526]/80 backdrop-blur-lg z-20 sticky top-0">

          {/* Left: Hamburger + Tab Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 text-gray-500 hover:text-navy-900 dark:hover:text-white rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>

            {/* Tab Pills */}
            <div className="bg-gray-100/80 dark:bg-white/5 p-1 rounded-lg flex items-center gap-0.5 border border-gray-200/50 dark:border-white/5">
              {[
                { id: 'editor', icon: 'edit_square', label: 'Editor' },
                { id: 'job', icon: 'join_inner', label: 'Match' },
                { id: 'workflows', icon: 'smart_toy', label: 'Agents' },
                { id: 'code', icon: 'code', label: 'Code' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === tab.id
                    ? 'bg-white dark:bg-navy-800 shadow-sm text-navy-900 dark:text-white ring-1 ring-black/5 dark:ring-white/10'
                    : 'hover:bg-white/50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400'
                    }`}
                >
                  <span className="material-symbols-outlined text-sm mr-1.5">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden lg:block" />

            {/* Pipeline Active Indicator */}
            {activePipeline && (
              <div className="hidden lg:flex items-center px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-800 gap-1.5">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
                {activePipeline.name}
                <button onClick={() => { setActivePipeline(null); handleCompile(profileData, null); }} className="ml-1 hover:text-amber-800 dark:hover:text-amber-200">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">

            {/* PDF Preview Toggle — the key Overleaf-style button */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${showPreview
                ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700'
                : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
            >
              <span className="material-symbols-outlined text-base">{showPreview ? 'vertical_split' : 'picture_as_pdf'}</span>
              <span className="hidden sm:inline">{showPreview ? 'Hide Preview' : 'PDF Preview'}</span>
            </button>

            {/* Focus Mode */}
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${isFocusMode
                ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700'
                : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
            >
              <span className="material-symbols-outlined text-base">center_focus_strong</span>
              <span className="hidden xl:inline">{isFocusMode ? 'Exit Focus' : 'Focus'}</span>
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

            {/* Live Sync Badge */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2.5 py-1 rounded-full ring-1 ring-teal-100 dark:ring-teal-800">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="tracking-wide uppercase text-[10px]">Sync</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-navy-900 dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>

            {/* Export PDF */}
            <a
              href={pdfUrl || '#'}
              download="resume.pdf"
              className={`bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98] ${!pdfUrl && 'opacity-50 pointer-events-none'}`}
            >
              <span className="material-symbols-outlined text-base mr-1.5">download</span>
              Export
            </a>
          </div>
        </header>

        {/* ====== SPLIT CONTENT AREA ====== */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* LEFT: Content Pane (always visible, takes full or half width) */}
          <div className={`flex flex-col overflow-y-auto bg-[#F0F2F5] dark:bg-[#0B1120] custom-scrollbar z-10 relative transition-all duration-300 ${showPreview ? 'w-full lg:w-1/2' : 'w-full'}`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

            {/* EDITOR TAB */}
            {activeTab === 'editor' && (
              <div className={`mx-auto w-full p-8 pb-32 relative z-10 ${showPreview ? 'max-w-2xl' : 'max-w-4xl'}`}>
                <div className="mb-10 text-center lg:text-left">
                  <h2 className="font-serif text-3xl font-medium text-navy-900 dark:text-white mb-2">Craft your narrative</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Fill in the details below to generate your professional profile.</p>
                </div>
                {profileData ? (
                  <ResumeForm data={profileData} onChange={(newData) => { setProfileData(newData); handleCompile(newData); }} />
                ) : (
                  <div className="text-center py-20 opacity-50">
                    <span className="material-symbols-outlined text-6xl mb-4">person_off</span>
                    <p>No profile data loaded. Use the sidebar to generate one.</p>
                  </div>
                )}
              </div>
            )}

            {/* JOB MATCH TAB */}
            {activeTab === 'job' && (
              <div className={`mx-auto w-full p-8 pb-32 relative z-10 h-full flex flex-col ${showPreview ? 'max-w-2xl' : 'max-w-4xl'}`}>
                <h2 className="font-serif text-2xl font-medium text-navy-900 dark:text-white mb-6">Job Alignment</h2>
                <textarea
                  className="flex-1 w-full bg-white dark:bg-[#151E2E] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-boutique resize-none focus:ring-2 focus:ring-teal-400 text-sm"
                  placeholder="Paste the Job Description here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
                <button
                  onClick={() => handleCompile()}
                  className="mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/20"
                >
                  Analyze Match
                </button>
                {analysis && (
                  <div className="mt-8 p-6 bg-white dark:bg-[#151E2E] rounded-2xl shadow-boutique border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Match Score</span>
                      <span className={`text-2xl font-black ${analysis.match_score > 70 ? 'text-teal-500' : 'text-orange-500'}`}>{analysis.match_score}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${analysis.match_score > 70 ? 'bg-teal-500' : 'bg-orange-500'}`} style={{ width: `${analysis.match_score}%` }} />
                    </div>
                    {analysis.missing_critical_skills && (
                      <div className="mt-4">
                        <p className="text-sm font-bold text-red-400 mb-2">Missing Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missing_critical_skills.map((skill: string) => (
                            <span key={skill} className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded border border-red-500/20">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* AGENTS TAB */}
            {activeTab === 'workflows' && (
              <WorkflowsTab onRunPipeline={handleRunPipeline} />
            )}

            {/* CODE TAB */}
            {activeTab === 'code' && (
              <div className="h-full relative z-10">
                <Editor
                  height="100%"
                  defaultLanguage="markdown"
                  theme={darkMode ? "vs-dark" : "light"}
                  value={typstCode}
                  options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                />
              </div>
            )}

            {/* TEMPLATES TAB */}
            {activeTab === 'templates' && (
              <div className={`mx-auto w-full p-8 pb-32 relative z-10 text-center ${showPreview ? 'max-w-2xl' : 'max-w-4xl'}`}>
                <div className="bg-white dark:bg-[#151E2E] p-10 rounded-3xl shadow-boutique border border-white/10">
                  <span className="material-symbols-outlined text-6xl text-blue-300 mb-4">style</span>
                  <h2 className="font-serif text-2xl font-medium text-navy-900 dark:text-white mb-2">Templates Library</h2>
                  <p className="text-gray-500 dark:text-gray-400">More custom styles coming soon.</p>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className={`mx-auto w-full p-8 pb-32 relative z-10 text-center ${showPreview ? 'max-w-2xl' : 'max-w-4xl'}`}>
                <div className="bg-white dark:bg-[#151E2E] p-10 rounded-3xl shadow-boutique border border-white/10">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">settings</span>
                  <h2 className="font-serif text-2xl font-medium text-navy-900 dark:text-white mb-2">Account Settings</h2>
                  <p className="text-gray-500 dark:text-gray-400">Manage your subscription and preferences.</p>
                  <button onClick={handleLogout} className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold">Sign Out</button>
                </div>
              </div>
            )}
          </div>

          {/* Draggable Divider (visual only) */}
          {showPreview && (
            <div className="hidden lg:flex w-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-teal-400 dark:hover:bg-teal-500 cursor-col-resize transition-colors flex-shrink-0 items-center justify-center group z-20">
              <div className="w-0.5 h-8 bg-gray-400 dark:bg-gray-600 group-hover:bg-white rounded-full" />
            </div>
          )}

          {/* RIGHT: PDF Preview Pane (toggle-controlled) */}
          {showPreview && (
            <div className="hidden lg:flex w-1/2 bg-gray-100 dark:bg-[#050911] flex-col relative border-l border-gray-200 dark:border-white/5 flex-shrink-0">

              {/* Preview Header Bar */}
              <div className="h-10 flex items-center justify-between px-4 bg-white/80 dark:bg-[#0d1526]/80 border-b border-gray-200/80 dark:border-white/5 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-500">picture_as_pdf</span>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">PDF Preview</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                    <span className="material-symbols-outlined text-base">zoom_out</span>
                  </button>
                  <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-400 w-8 text-center">100%</span>
                  <button className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                    <span className="material-symbols-outlined text-base">zoom_in</span>
                  </button>
                  <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                    title="Close Preview"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>

              {/* PDF Rendering Area */}
              <div className="flex-1 overflow-auto flex justify-center p-6">
                <div className="bg-white text-gray-900 w-[210mm] min-h-[297mm] h-fit shadow-2xl relative">
                  {pdfUrl ? (
                    <iframe src={pdfUrl} className="w-full h-[297mm] border-none" title="PDF Preview" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[297mm] text-gray-400">
                      <span className="material-symbols-outlined text-6xl mb-4 opacity-50">description</span>
                      <p className="text-sm">Generate a profile to see the preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}