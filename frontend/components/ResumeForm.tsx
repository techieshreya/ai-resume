import React, { useState} from 'react';
import { User, Mail, FileText, Briefcase, Wand2, Loader2, Plus, Trash2, Github } from 'lucide-react';
import axios from 'axios';

interface ResumeFormProps {
  data: any;
  onChange: (newData: any) => void;
  isDarkMode?: boolean; // Added this prop
}

const API_URL = "http://localhost:8000";

export default function ResumeForm({ data, onChange, isDarkMode = true }: ResumeFormProps) {
  const [rewritingIndex, setRewritingIndex] = useState<number | null>(null);

  // ================= THEME ENGINE =================
  const theme = {
    // Text
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSec: isDarkMode ? "text-gray-400" : "text-gray-500",
    label: isDarkMode ? "text-gray-500" : "text-gray-600",
    placeholder: isDarkMode ? "placeholder-gray-600" : "placeholder-gray-400",
    
    // Backgrounds & Borders
    bg: isDarkMode ? "bg-[#0A0A0A]" : "bg-transparent", // Transparent lets parent bg show
    cardBg: isDarkMode ? "bg-white/5" : "bg-white",
    inputBg: isDarkMode ? "bg-white/5" : "bg-white",
    border: isDarkMode ? "border-white/10" : "border-gray-200",
    focusBorder: isDarkMode ? "focus:border-blue-500/50" : "focus:border-blue-500",
    
    // Specific Input Styles
    inputClasses: `w-full p-3.5 rounded-xl outline-none transition-all duration-200 backdrop-blur-sm border 
      ${isDarkMode 
        ? "bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 text-white focus:bg-white/[0.07]" 
        : "bg-white border-gray-200 text-gray-900 focus:bg-white shadow-sm hover:border-gray-300"
      }`
  };

  // ================= HANDLERS =================
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleProjectChange = (index: number, field: string, value: any) => {
    const newProjects = [...(data.projects || [])];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onChange({ ...data, projects: newProjects });
  };

  const handleRewrite = async (index: number, currentText: string) => {
    if (!currentText) return;
    setRewritingIndex(index);
    try {
      const res = await axios.post(`${API_URL}/rewrite`, { text: currentText });
      handleProjectChange(index, "description_raw", res.data.refined_text);
    } catch (error) {
      alert("AI Rewrite failed. Check console.");
      console.error(error);
    }
    setRewritingIndex(null);
  };

  const addProject = () => {
    const newProjects = [...(data.projects || []), {
      name: "New Project",
      tech_stack: [],
      description_raw: ""
    }];
    onChange({ ...data, projects: newProjects });
  };

  const deleteProject = (index: number) => {
    const newProjects = data.projects.filter((_: any, i: number) => i !== index);
    onChange({ ...data, projects: newProjects });
  };

  // ================= RENDER =================
  return (
    <div className={`p-8 space-y-10 overflow-y-auto h-full pb-24 ${theme.bg}`}>
      
      {/* ========== PERSONAL INFO SECTION ========== */}
      <section className="space-y-5">
        <div className={`flex items-center gap-3 pb-4 border-b ${theme.border}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <User size={16} className="text-white" />
          </div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Personal Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-2 group">
            <label className={`text-xs uppercase font-bold ${theme.label} tracking-wider`}>
              Full Name
            </label>
            <div className="relative">
              <input
                className={`${theme.inputClasses} ${theme.placeholder} ${theme.focusBorder}`}
                value={data.full_name || ""}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* GitHub Username (Read-only) */}
          <div className="space-y-2">
            <label className={`text-xs uppercase font-bold ${theme.label} tracking-wider flex items-center gap-2`}>
              <Github size={12} />
              GitHub Username
            </label>
            <div className="relative">
              <input
                className={`w-full p-3.5 rounded-xl cursor-not-allowed border ${isDarkMode ? "bg-white/[0.02] border-white/5 text-gray-500" : "bg-gray-100 border-gray-200 text-gray-500"}`}
                value={data.github_username || ""}
                readOnly
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">
                Auto
              </div>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2 group">
          <label className={`text-xs uppercase font-bold ${theme.label} tracking-wider`}>
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={16} />
            </div>
            <input
              className={`${theme.inputClasses} pl-12 ${theme.placeholder} ${theme.focusBorder}`}
              value={data.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="you@example.com"
              type="email"
            />
          </div>
        </div>
      </section>

      {/* ========== PROFESSIONAL SUMMARY ========== */}
      <section className="space-y-5">
        <div className={`flex items-center gap-3 pb-4 border-b ${theme.border}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FileText size={16} className="text-white" />
          </div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Professional Summary
          </h3>
        </div>
        
        <div className="space-y-2 group">
          <label className={`text-xs uppercase font-bold ${theme.label} tracking-wider`}>
            About You
          </label>
          <div className="relative">
            <textarea
              className={`${theme.inputClasses} h-40 resize-none leading-relaxed ${theme.placeholder} ${theme.focusBorder}`}
              value={data.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Write a compelling professional summary that highlights your expertise and career goals..."
            />
          </div>
        </div>
      </section>

      {/* ========== PROJECTS SECTION ========== */}
      <section className="space-y-6">
        <div className={`flex items-center justify-between pb-4 border-b ${theme.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Briefcase size={16} className="text-white" />
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              Projects
            </h3>
          </div>
          
          <button
            onClick={addProject}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 active:scale-95"
          >
            <Plus size={16} />
            Add Project
          </button>
        </div>
        
        {data.projects?.map((project: any, index: number) => (
          <div
            key={index}
            className={`group relative ${theme.cardBg} border ${theme.border} p-6 rounded-2xl space-y-5 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 shadow-sm`}
          >
            {/* Delete Button */}
            <button
              onClick={() => deleteProject(index)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Delete Project"
            >
              <Trash2 size={14} />
            </button>

            {/* Project Header */}
            <div className="flex items-center justify-between pr-10">
              <input
                className={`bg-transparent text-xl font-bold outline-none w-full transition-colors ${theme.text} placeholder-gray-400 focus:text-blue-500`}
                value={project.name}
                onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                placeholder="Project Name"
              />
              <span className={`text-[10px] uppercase font-bold ${theme.textSec} ${isDarkMode ? "bg-white/10" : "bg-gray-100"} px-2 py-1 rounded`}>
                #{index + 1}
              </span>
            </div>
            
            {/* Tech Stack */}
            <div className="space-y-2">
              <label className={`text-xs uppercase font-bold ${theme.label} tracking-wider`}>
                Tech Stack
              </label>
              <div className="relative group/tech">
                <input
                  className={`${theme.inputClasses} ${isDarkMode ? "text-blue-300" : "text-blue-600"} ${theme.placeholder} ${theme.focusBorder}`}
                  value={project.tech_stack?.join(", ") || ""}
                  onChange={(e) => handleProjectChange(index, "tech_stack", e.target.value.split(",").map(s => s.trim()))}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
            </div>

            {/* Description with AI Rewrite */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className={`text-xs uppercase font-bold ${theme.label} tracking-wider`}>
                  Description
                </label>
                
                {/* AI MAGIC BUTTON */}
                <button
                  onClick={() => handleRewrite(index, project.description_raw)}
                  disabled={rewritingIndex === index}
                  className="group/ai relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] group-hover/ai:bg-[position:100%_0] transition-all duration-500"></div>
                  <span className="relative z-10 flex items-center gap-1.5 text-white">
                    {rewritingIndex === index ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Rewriting...
                      </>
                    ) : (
                      <>
                        <Wand2 size={12} className="group-hover/ai:rotate-12 transition-transform" />
                        AI Enhance
                      </>
                    )}
                  </span>
                </button>
              </div>
              
              <div className="relative group/desc">
                <textarea
                  className={`${theme.inputClasses} h-36 resize-none leading-relaxed ${theme.placeholder} ${theme.focusBorder}`}
                  value={project.description_raw || ""}
                  onChange={(e) => handleProjectChange(index, "description_raw", e.target.value)}
                  placeholder="Describe your project... (e.g., 'Built a real-time chat app with WebSocket integration')"
                />
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {(!data.projects || data.projects.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className={`w-20 h-20 rounded-2xl ${theme.inputBg} border ${theme.border} flex items-center justify-center mb-4`}>
              <Briefcase size={32} className="text-gray-400" />
            </div>
            <p className={`${theme.textSec} font-medium mb-2`}>No projects yet</p>
            <p className={`text-sm ${theme.textSec} mb-6 max-w-md`}>
              Start building your portfolio by adding your first project. Click the "Add Project" button above.
            </p>
            <button
              onClick={addProject}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 active:scale-95"
            >
              <Plus size={16} />
              Create First Project
            </button>
          </div>
        )}
      </section>

      {/* Bottom Spacer for Scroll */}
      <div className="h-20"></div>
    </div>
  );
}