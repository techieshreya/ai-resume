"use client";
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
// Added Target (Bullseye), AlertTriangle (Warning), and CheckCircle icons
import { Play, Download, Code, FileText, Save, Target, AlertTriangle, CheckCircle } from 'lucide-react'; 
import axios from 'axios';
import ResumeForm from '../components/ResumeForm';

const API_URL = "http://localhost:8000"; 

export default function Home() {
  const [username, setUsername] = useState("techieshreya"); 
  const [profileData, setProfileData] = useState<any>(null); 
  
  // --- NEW STATE: Job Matching ---
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const [typstCode, setTypstCode] = useState("// Loading...");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("form"); 

  // 1. Initial Load (Fetch from GitHub via Python)
  const handleInitialLoad = async () => {
    setLoading(true);
    try {
      const payload = {
        username: username,
        profile_data: {
            full_name: username,
            github_username: username,
            email: "your.email@example.com",
            bio: "Aspiring Software Engineer...",
            projects: [
                { name: "Demo Project 1", tech_stack: ["Python", "React"], description_raw: "Built a cool app." },
                { name: "Demo Project 2", tech_stack: ["Docker", "FastAPI"], description_raw: "Deployed a microservice." }
            ]
        },
        jd_text: ""
      };
      
      setProfileData(payload.profile_data);
      const res = await axios.post(`${API_URL}/generate`, payload);
      setTypstCode(res.data.typst_code);
      setPdfUrl(`${API_URL}/static/resume.pdf?t=${Date.now()}`);
      
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend.");
    }
    setLoading(false);
  };

  // 2. The Big Save & Analyze Function
  const handleCompile = async () => {
    if (!profileData) return;
    setLoading(true);
    try {
        const payload = {
            username: username,
            profile_data: profileData,
            jd_text: jdText // <--- Send JD to backend for analysis
        };

        const res = await axios.post(`${API_URL}/generate`, payload);
        
        // Update PDF & Code
        setTypstCode(res.data.typst_code);
        setPdfUrl(`${API_URL}/static/resume.pdf?t=${Date.now()}`);
        
        // --- NEW: Update Analysis Score ---
        if (res.data.analysis) {
            setAnalysis(res.data.analysis);
            // Auto-switch to job tab if user pasted a JD
            if (jdText.length > 10) setActiveTab("job");
        }
    } catch (e) {
        alert("Compile failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
        <div className="p-4 border-b border-gray-700 font-bold text-lg flex items-center gap-2">
           📄 Resume.ai
        </div>
        
        {/* --- NEW: SCORE CARD (Visible if analyzed) --- */}
        {analysis && (
            <div className={`p-4 m-2 rounded border ${analysis.match_score > 70 ? 'bg-green-900/50 border-green-600' : 'bg-red-900/50 border-red-600'}`}>
                <div className="text-xs uppercase font-bold text-gray-300 mb-1">Match Score</div>
                <div className="text-3xl font-bold">{analysis.match_score}%</div>
                <div className="text-xs text-gray-300 mt-2 italic">{analysis.critique}</div>
            </div>
        )}

        <div className="p-4 space-y-4">
          <label className="text-xs uppercase text-gray-400 font-semibold">User Setup</label>
          <input 
            className="w-full bg-gray-700 p-2 rounded text-sm text-white border border-gray-600 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button 
            onClick={handleInitialLoad}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded flex items-center justify-center gap-2 transition"
          >
            {loading ? "Working..." : <><Play size={16}/> Load Data</>}
          </button>
        </div>
      </div>

      {/* CENTER PANEL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
           <div className="flex gap-4 text-sm">
              <button onClick={() => setActiveTab("form")} className={`flex items-center gap-2 ${activeTab === 'form' ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>
                <FileText size={16}/> Editor
              </button>
              <button onClick={() => setActiveTab("job")} className={`flex items-center gap-2 ${activeTab === 'job' ? 'text-purple-400 font-bold' : 'text-gray-400'}`}>
                <Target size={16}/> Job Match
              </button>
              <button onClick={() => setActiveTab("code")} className={`flex items-center gap-2 ${activeTab === 'code' ? 'text-gray-400 font-bold' : 'text-gray-400'}`}>
                <Code size={16}/> Code
              </button>
           </div>
           
           <button onClick={handleCompile} className="bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded text-sm font-semibold flex items-center gap-2">
             <Save size={14}/> Save & Analyze
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden bg-gray-900">
           
           {/* TAB 1: FORM */}
           {activeTab === 'form' && profileData && (
              <ResumeForm data={profileData} onChange={setProfileData} />
           )}

           {/* TAB 2: JOB MATCHER (New!) */}
           {activeTab === 'job' && (
              <div className="p-6 h-full flex flex-col gap-6">
                 <div className="flex-1 flex flex-col">
                    <label className="text-gray-400 font-bold mb-2 flex items-center gap-2">
                        <Target size={16}/> Paste Job Description Here
                    </label>
                    <textarea 
                        className="flex-1 bg-gray-800 border border-gray-700 p-4 rounded text-sm text-gray-300 focus:border-purple-500 outline-none resize-none"
                        placeholder="Paste the JD here to detect missing keywords..."
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                    />
                 </div>

                 {/* ANALYSIS RESULT */}
                 {analysis && (
                     <div className="h-1/3 bg-gray-800/50 border border-gray-700 rounded p-4 overflow-y-auto">
                        <h3 className="text-red-400 font-bold flex items-center gap-2 mb-3">
                            <AlertTriangle size={18}/> Missing Critical Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {/* Uses 'missing_critical_skills' from your gap_analyzer.py */}
                            {analysis.missing_critical_skills?.map((kw: string, i: number) => (
                                <span key={i} className="bg-red-900/50 text-red-200 px-3 py-1 rounded text-xs border border-red-700">
                                    {kw}
                                </span>
                            ))}
                            {(!analysis.missing_critical_skills || analysis.missing_critical_skills.length === 0) && (
                                <span className="text-green-400 flex items-center gap-2">
                                    <CheckCircle size={16}/> No missing keywords! Great job.
                                </span>
                            )}
                        </div>
                     </div>
                 )}
              </div>
           )}

           {/* TAB 3: CODE */}
           {activeTab === 'code' && (
             <Editor height="100%" defaultLanguage="markdown" theme="vs-dark" value={typstCode} options={{ minimap: { enabled: false } }} />
           )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[50%] bg-gray-500 flex flex-col border-l border-gray-700">
        <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
            <span className="text-sm font-semibold text-gray-300">PDF Preview</span>
            <button className="text-gray-400 hover:text-white"><Download size={18}/></button>
        </div>
        <div className="flex-1 bg-gray-500 flex items-center justify-center overflow-hidden">
           {pdfUrl ? <iframe src={pdfUrl} className="w-full h-full" title="PDF"/> : <div className="text-gray-200">Waiting...</div>}
        </div>
      </div>

    </div>
  );
}