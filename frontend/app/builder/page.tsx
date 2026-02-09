"use client";
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, Download, Code, FileText, Target, AlertTriangle, 
  CheckCircle, Sparkles, Zap, Moon, Sun, PanelLeft, 
  PanelRightOpen, PanelRightClose, Menu, Loader2 
} from 'lucide-react';
import axios from 'axios';
import ResumeForm from '@/components/ResumeForm'; // Ensure path is correct

const API_URL = "http://localhost:8000";

export default function Home() {
  // ================= STATE =================
  const [darkMode, setDarkMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  // App Data State
  const [username, setUsername] = useState("techieshreya");
  const [profileData, setProfileData] = useState<any>(null);
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [typstCode, setTypstCode] = useState("// Loading...");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("form");

  // ================= THEME HELPERS =================
  const theme = {
    bg: darkMode ? "bg-[#0A0A0A]" : "bg-gray-50",
    bgPanel: darkMode ? "bg-[#111111]" : "bg-white",
    textMain: darkMode ? "text-gray-100" : "text-gray-900",
    textSec: darkMode ? "text-gray-400" : "text-gray-500",
    border: darkMode ? "border-white/5" : "border-black/10",
    inputBg: darkMode ? "bg-white/5" : "bg-gray-100",
    hoverBg: darkMode ? "hover:bg-white/5" : "hover:bg-gray-100",
    glass: darkMode ? "backdrop-blur-xl bg-[#111111]/80" : "backdrop-blur-xl bg-white/80",
    card: darkMode ? "bg-gradient-to-br from-white/5 to-white/[0.02]" : "bg-white shadow-sm",
  };

  // ================= HANDLERS =================
  
  // 1. LOAD DATA (FIXED: Now actually calls Backend)
  const handleInitialLoad = async () => {
    if (!username) return;
    setLoading(true);
    console.log(`🔵 Requesting profile for: ${username}...`);

    try {
      // Call the backend endpoint
      const res = await axios.get(`${API_URL}/profile/${username}`);
      console.log("🟢 Data received:", res.data);
      
      // Update State
      setProfileData(res.data);
      
      // Auto-compile immediately after loading
      await handleCompile(res.data);

    } catch (error) {
      console.error("🔴 Error fetching profile:", error);
      alert("User not found on GitHub. Using empty template.");
      
      // Fallback: Empty template
      const emptyData = {
        full_name: username,
        github_username: username,
        email: "",
        bio: "",
        projects: []
      };
      setProfileData(emptyData);
      handleCompile(emptyData);
    }
    setLoading(false);
  };

  // 2. COMPILE PDF (FIXED: Sends data to Backend)
  const handleCompile = async (dataToUse = profileData) => {
    if (!dataToUse) return;
    
    // Don't set full loading screen for compile, just minor updates if needed
    // But here we use loading state to show activity
    
    try {
      const payload = { 
          username, 
          profile_data: dataToUse, 
          jd_text: jdText 
      };
      
      console.log("⚡ Compiling PDF...", payload);
      const res = await axios.post(`${API_URL}/generate`, payload);
      
      setTypstCode(res.data.typst_code);
      // Add timestamp to force iframe refresh
      setPdfUrl(`${API_URL}/static/resume.pdf?t=${Date.now()}`);
      
      if (res.data.analysis) {
        setAnalysis(res.data.analysis);
        if (jdText.length > 10) setActiveTab("job"); // Switch to job tab if analyzing
      }
    } catch (e) {
      console.error("Compile failed", e);
      alert("Compilation failed. Check backend console.");
    }
  };

  // ================= RENDER =================
  return (
    <div className={`flex h-screen ${theme.bg} ${theme.textMain} overflow-hidden font-sans antialiased transition-colors duration-300`}>
      
      {/* 1. LEFT SIDEBAR (Collapsible) */}
      {showSidebar && (
        <aside className={`w-72 flex flex-col border-r ${theme.border} ${theme.glass} transition-all duration-300`}>
          
          {/* Logo Header */}
          <div className={`p-6 border-b ${theme.border}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Resume.ai
                </h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Smart Builder</p>
              </div>
            </div>
          </div>

          {/* Match Score Card */}
          {analysis && (
            <div className={`m-4 p-5 rounded-2xl ${theme.card} border ${theme.border} relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Match Score</span>
                <Target className={`w-4 h-4 ${analysis.match_score > 70 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-5xl font-black bg-gradient-to-br ${analysis.match_score > 70 ? 'from-green-400 to-emerald-300' : 'from-red-400 to-orange-300'} bg-clip-text text-transparent`}>
                  {analysis.match_score}
                </span>
                <span className="text-gray-500 text-sm font-medium">/ 100</span>
              </div>
              <div className="w-full h-1.5 bg-gray-500/20 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${analysis.match_score > 70 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${analysis.match_score}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* User Setup */}
          <div className="p-6 space-y-4 flex-1">
            <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest block">
              User Setup
            </label>
            <div className="relative group">
              <input
                className={`w-full ${theme.inputBg} border ${theme.border} p-3 rounded-xl text-sm outline-none focus:border-blue-500/50 transition-all duration-200`}
                placeholder="GitHub Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button
              onClick={handleInitialLoad}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white p-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><Play size={16} /> Load Data</>}
            </button>
          </div>

          <div className={`p-4 border-t ${theme.border}`}>
            <p className="text-[10px] text-gray-600 text-center">Powered by AI • v2.0</p>
          </div>
        </aside>
      )}

      {/* 2. CENTER PANEL (Main Area) */}
      <main className={`flex-1 flex flex-col min-w-0 ${theme.bg} transition-all duration-300 relative`}>
        
        {/* Main Header (Toolbar) */}
        <header className={`h-16 ${theme.glass} border-b ${theme.border} flex items-center justify-between px-4 z-20`}>
          
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle */}
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-lg ${theme.hoverBg} ${theme.textSec} transition-colors`}
              title="Toggle Sidebar"
            >
              {showSidebar ? <PanelLeft size={20} /> : <Menu size={20} />}
            </button>

            {/* Tabs */}
            <div className={`hidden md:flex items-center gap-1 ${theme.inputBg} p-1 rounded-xl border ${theme.border}`}>
              {[
                { id: 'form', label: 'Visual Editor', icon: FileText, color: 'blue' },
                { id: 'job', label: 'Job Match', icon: Target, color: 'purple' },
                { id: 'code', label: 'Code View', icon: Code, color: 'gray' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                    ${activeTab === tab.id
                      ? `bg-white shadow-sm text-black` 
                      : `${theme.textSec} hover:${theme.textMain}`
                    }
                  `}
                >
                  <tab.icon size={14} className={activeTab === tab.id ? `text-${tab.color}-500` : ''} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${theme.hoverBg} ${theme.textSec} hover:text-yellow-400 transition-colors`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Save Button */}
            <button
              onClick={() => handleCompile(profileData)}
              disabled={loading}
              className="group relative px-5 py-2 rounded-xl font-semibold text-sm transition-all overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/20 active:scale-95"
            >
               <span className="flex items-center gap-2">
                 <Zap size={16} /> Save & Analyze
               </span>
            </button>
            
            {/* Preview Toggle (Right) */}
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-lg ${theme.hoverBg} ${theme.textSec} transition-colors`}
              title="Toggle PDF Preview"
            >
              {showPreview ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 relative overflow-hidden">
          
          {/* TAB: VISUAL EDITOR */}
          {activeTab === 'form' && (
            <div className="h-full overflow-y-auto p-4">
              {profileData ? (
                 <ResumeForm data={profileData} onChange={setProfileData} isDarkMode={darkMode} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <p>Load user data to begin editing</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: JOB MATCH */}
          {activeTab === 'job' && (
            <div className="p-8 h-full flex flex-col gap-6">
              <div className="flex-1 flex flex-col min-h-0">
                <label className="text-gray-400 font-bold mb-3 flex items-center gap-2 text-sm">
                  <Target size={18} className="text-purple-400" /> Job Description
                </label>
                <textarea
                  className={`w-full h-full ${theme.card} border ${theme.border} p-5 rounded-2xl text-sm ${theme.textMain} focus:border-purple-500/50 outline-none resize-none`}
                  placeholder="Paste JD here to analyze missing skills..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </div>
              
              {/* Analysis Results (Only show if available) */}
              {analysis && analysis.missing_critical_skills && (
                  <div className={`p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-200`}>
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                          <AlertTriangle size={16}/> Missing Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                          {analysis.missing_critical_skills.map((skill:string, i:number) => (
                              <span key={i} className="px-2 py-1 bg-red-500/20 rounded text-xs">{skill}</span>
                          ))}
                      </div>
                  </div>
              )}
            </div>
          )}

          {/* TAB: CODE */}
          {activeTab === 'code' && (
            <div className="h-full">
              <Editor
                height="100%"
                defaultLanguage="markdown"
                theme={darkMode ? "vs-dark" : "light"}
                value={typstCode}
                options={{ minimap: { enabled: false }, fontSize: 14 }}
              />
            </div>
          )}
        </div>
      </main>

      {/* 3. RIGHT PANEL (PDF Preview) - Collapsible */}
      {showPreview && (
        <aside className={`w-[45%] flex flex-col border-l ${theme.border} ${theme.glass} transition-all duration-300`}>
          <header className={`h-16 border-b ${theme.border} flex items-center justify-between px-6`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className={`text-sm font-semibold ${theme.textMain}`}>Live Preview</span>
            </div>
            <a 
              href={pdfUrl || '#'}
              download="resume.pdf"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${theme.textSec} ${theme.hoverBg} text-sm font-medium ${!pdfUrl && 'opacity-50 pointer-events-none'}`}
            >
              <Download size={16} /> Export
            </a>
          </header>

          <div className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-gray-200"} flex items-center justify-center overflow-hidden relative p-4`}>
            {pdfUrl ? (
              <iframe src={pdfUrl} className="w-full h-full rounded-xl shadow-2xl bg-white" title="PDF Preview" />
            ) : (
              <div className="text-center text-gray-500">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>Preview will appear here</p>
              </div>
            )}
          </div>
        </aside>
      )}

    </div>
  );
}