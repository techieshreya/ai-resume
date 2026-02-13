import React, { useState } from 'react';
import axios from 'axios';

const API_URL = "https://ai-resume-production-564b.up.railway.app";

interface ResumeFormProps {
  data: any;
  onChange: (newData: any) => void;
  isDarkMode?: boolean;
}

export default function ResumeForm({ data, onChange, isDarkMode = true }: ResumeFormProps) {
  const [rewritingIndex, setRewritingIndex] = useState<number | null>(null);

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

  return (
    <div className="space-y-8">

      {/* 1. PERSONAL DETAILS */}
      <section className="rounded-2xl bg-white dark:bg-[#151E2E] shadow-boutique card-grain border border-white/50 dark:border-white/5 group hover:border-teal-400/30 dark:hover:border-teal-400/30 transition-colors duration-300">
        <div className="card-content p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-navy-50 dark:bg-navy-900 flex items-center justify-center text-navy-900 dark:text-teal-400 mr-4 ring-4 ring-navy-50/50 dark:ring-navy-900/50">
                <span className="material-symbols-outlined text-xl">person_outline</span>
              </div>
              <h2 className="font-serif text-xl text-navy-900 dark:text-white">Personal Details</h2>
            </div>
            <span className="text-xs font-bold text-teal-500 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded">100%</span>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="col-span-2 lg:col-span-1">
              <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 font-sans">Full Name</label>
              <input
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 text-sm font-medium text-navy-900 dark:text-white focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all placeholder:text-gray-400"
                type="text"
                value={data.full_name || ""}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="Ex. Jane Doe"
              />
            </div>
            {/* Note: Profile Title/Role isn't in original data schema but good to add if supported */}
            <div className="col-span-2 lg:col-span-1">
              <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 font-sans">GitHub Username</label>
              <input
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed"
                type="text"
                value={data.github_username || ""}
                readOnly
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 font-sans">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </span>
              <input
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 text-sm font-medium text-navy-900 dark:text-white focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all"
                type="email"
                value={data.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROFESSIONAL SUMMARY */}
      <section className="rounded-2xl bg-white dark:bg-[#151E2E] shadow-boutique card-grain border border-white/50 dark:border-white/5 group hover:border-purple-400/30 dark:hover:border-purple-400/30 transition-colors duration-300">
        <div className="card-content p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-purple-50 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-300 mr-4 ring-4 ring-purple-50/50 dark:ring-purple-900/30">
                <span className="material-symbols-outlined text-xl">auto_awesome</span>
              </div>
              <h2 className="font-serif text-xl text-navy-900 dark:text-white">Professional Summary</h2>
            </div>
            {/* AI Rewrite for Bio? If implemented later */}
          </div>
          <div>
            <textarea
              className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl py-4 px-4 text-sm font-medium text-navy-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all leading-relaxed resize-none shadow-inner scrollbar-thin"
              rows={6}
              value={data.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Aspiring Software Engineer with a passion for building scalable web applications..."
            />
            <div className="flex justify-between mt-3 text-xs text-gray-400">
              <span>Suggested length: 3-5 sentences</span>
              <span>{data.bio?.length || 0} characters</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KEY PROJECTS */}
      <section className="rounded-2xl bg-white dark:bg-[#151E2E] shadow-boutique card-grain border border-white/50 dark:border-white/5 group hover:border-blue-400/30 dark:hover:border-blue-400/30 transition-colors duration-300">
        <div className="card-content p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-4 ring-4 ring-blue-50/50 dark:ring-blue-900/30">
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
              </div>
              <h2 className="font-serif text-xl text-navy-900 dark:text-white">Key Projects</h2>
            </div>
            <button
              onClick={addProject}
              className="bg-navy-900 hover:bg-navy-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-navy-900 text-xs font-bold py-2 px-4 rounded-lg flex items-center shadow-lg transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm mr-1">add</span>
              Add Project
            </button>
          </div>

          {/* Projects List */}
          {(!data.projects || data.projects.length === 0) ? (
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-10 text-center bg-gray-50/50 dark:bg-black/20 hover:bg-gray-50 dark:hover:bg-black/30 transition-colors cursor-pointer" onClick={addProject}>
              <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">folder_open</span>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Your portfolio is empty.</p>
              <p className="text-xs text-gray-400 mt-1">Showcase your best work here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {data.projects.map((project: any, index: number) => (
                <div key={index} className="relative p-6 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 group/project hover:border-blue-400/50 transition-all">

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteProject(index)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-500 opacity-0 group-hover/project:opacity-100 transition-opacity"
                    title="Delete Project"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>

                  <div className="grid gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Project Name</label>
                      <input
                        className="w-full bg-white dark:bg-[#151E2E] border border-gray-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm font-bold text-navy-900 dark:text-white focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
                        value={project.name}
                        onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                        placeholder="Project Name"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tech Stack</label>
                      <input
                        className="w-full bg-white dark:bg-[#151E2E] border border-gray-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 placeholder:text-gray-400"
                        value={project.tech_stack?.join(", ") || ""}
                        onChange={(e) => handleProjectChange(index, "tech_stack", e.target.value.split(",").map(s => s.trim()))}
                        placeholder="React, Node.js..."
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                        <button
                          onClick={() => handleRewrite(index, project.description_raw)}
                          disabled={rewritingIndex === index}
                          className="flex items-center gap-1 text-[10px] font-bold text-purple-600 hover:text-purple-500 disabled:opacity-50"
                        >
                          <span className={`material-symbols-outlined text-sm ${rewritingIndex === index ? 'animate-spin' : ''}`}>
                            {rewritingIndex === index ? 'refresh' : 'auto_awesome'}
                          </span>
                          {rewritingIndex === index ? 'Rewriting...' : 'Rewrite with AI'}
                        </button>
                      </div>
                      <textarea
                        className="w-full bg-white dark:bg-[#151E2E] border border-gray-200 dark:border-white/10 rounded-lg py-3 px-3 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 leading-relaxed resize-none"
                        rows={4}
                        value={project.description_raw || ""}
                        onChange={(e) => handleProjectChange(index, "description_raw", e.target.value)}
                        placeholder="Describe your contribution..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}