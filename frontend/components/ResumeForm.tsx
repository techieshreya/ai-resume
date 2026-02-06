import React, { useState } from 'react';
// 1. Added Wand2 (Magic Icon), Loader2 (Spinner), and axios
import { User, Mail, FileText, Briefcase, Wand2, Loader2 } from 'lucide-react';
import axios from 'axios';

interface ResumeFormProps {
  data: any;
  onChange: (newData: any) => void;
}

const API_URL = "http://localhost:8000"; 

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
  
  // 2. State to track which button is currently spinning
  const [rewritingIndex, setRewritingIndex] = useState<number | null>(null);

  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleProjectChange = (index: number, field: string, value: any) => {
    const newProjects = [...(data.projects || [])];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onChange({ ...data, projects: newProjects });
  };

  // 3. THE AI FUNCTION: Sends text to Python -> Gets Professional Bullets
  const handleRewrite = async (index: number, currentText: string) => {
    if (!currentText) return;
    
    setRewritingIndex(index); // Start loading spinner
    try {
        const res = await axios.post(`${API_URL}/rewrite`, {
            text: currentText
        });
        
        // Update the form with the new AI text
        handleProjectChange(index, "description_raw", res.data.refined_text);
    } catch (error) {
        alert("AI Rewrite failed. Check console.");
        console.error(error);
    }
    setRewritingIndex(null); // Stop loading
  };

  return (
    <div className="p-6 space-y-8 text-sm overflow-y-auto h-full pb-20">
      
      {/* PERSONAL INFO */}
      <div className="space-y-4">
        <h3 className="text-blue-400 font-bold uppercase tracking-wider border-b border-gray-700 pb-2 flex items-center gap-2">
          <User size={16}/> Personal Info
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-gray-400">Full Name</label>
            <input 
              className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white focus:border-blue-500 outline-none"
              value={data.full_name || ""}
              onChange={(e) => handleChange("full_name", e.target.value)}
            />
          </div>
          <div className="space-y-1">
             <label className="text-gray-400">GitHub Username</label>
             <input 
               className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-gray-400 cursor-not-allowed"
               value={data.github_username || ""}
               readOnly
             />
          </div>
        </div>

        <div className="space-y-1">
           <label className="text-gray-400">Email</label>
           <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 p-2 rounded">
              <Mail size={16} className="text-gray-500"/>
              <input 
                className="bg-transparent w-full text-white outline-none"
                value={data.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="you@example.com"
              />
           </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="space-y-4">
        <h3 className="text-blue-400 font-bold uppercase tracking-wider border-b border-gray-700 pb-2 flex items-center gap-2">
          <FileText size={16}/> Professional Summary
        </h3>
        <textarea 
          className="w-full h-32 bg-gray-800 border border-gray-700 p-3 rounded text-white focus:border-blue-500 outline-none leading-relaxed"
          value={data.bio || ""}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Write your professional summary here..."
        />
      </div>

      {/* PROJECTS */}
      <div className="space-y-6">
        <h3 className="text-blue-400 font-bold uppercase tracking-wider border-b border-gray-700 pb-2 flex items-center gap-2">
          <Briefcase size={16}/> Projects
        </h3>
        
        {data.projects?.map((project: any, index: number) => (
          <div key={index} className="bg-gray-800/50 p-4 rounded border border-gray-700 space-y-3">
             <div className="flex justify-between items-center">
                <input 
                  className="bg-transparent font-bold text-white outline-none w-full"
                  value={project.name}
                  onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                />
                <span className="text-xs text-gray-500">Project #{index + 1}</span>
             </div>
             
             <div>
                <label className="text-xs text-gray-500 uppercase">Tech Stack</label>
                <input 
                   className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-xs text-blue-300 mt-1"
                   value={project.tech_stack?.join(",") || ""}
                   onChange={(e) => handleProjectChange(index, "tech_stack", e.target.value.split(","))}
                />
             </div>

             <div className="relative">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-gray-500 uppercase">Description</label>
                    
                    {/* 4. THE MAGIC BUTTON UI */}
                    <button 
                        onClick={() => handleRewrite(index, project.description_raw)}
                        className="flex items-center gap-1 text-xs bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded transition"
                        disabled={rewritingIndex === index}
                    >
                        {rewritingIndex === index ? (
                            <><Loader2 size={12} className="animate-spin"/> AI Rewriting...</>
                        ) : (
                            <><Wand2 size={12}/> AI Rewrite</>
                        )}
                    </button>
                </div>
                
                <textarea 
                   className="w-full h-32 bg-gray-900 border border-gray-700 p-2 rounded text-sm text-gray-300 focus:border-purple-500 outline-none transition"
                   value={project.description_raw || ""}
                   onChange={(e) => handleProjectChange(index, "description_raw", e.target.value)}
                   placeholder="Type rough notes here (e.g. 'built login system using oauth')..."
                />
             </div>
          </div>
        ))}
        
        {(!data.projects || data.projects.length === 0) && (
            <div className="text-gray-500 text-center italic p-4">
                No projects found.
            </div>
        )}
      </div>
    </div>
  );
}