import React, { useState, useEffect } from 'react';

// Define the Pipeline Config interface (matching backend)
export interface PipelineConfig {
    name: string;
    include_tags: string[];
    exclude_tags: string[];
    section_order: string[];
    template_id: string;
}

interface WorkflowsTabProps {
    onRunPipeline: (config: PipelineConfig) => void;
}

const ACCENT_GRADIENTS = [
    'from-teal-400 to-cyan-500',
    'from-violet-500 to-purple-600',
    'from-amber-400 to-orange-500',
    'from-rose-400 to-pink-500',
    'from-blue-400 to-indigo-500',
    'from-emerald-400 to-green-500',
];

const ICONS = ['smart_toy', 'psychology', 'precision_manufacturing', 'hub', 'memory', 'neurology'];

export default function WorkflowsTab({ onRunPipeline }: WorkflowsTabProps) {
    const [pipelines, setPipelines] = useState<PipelineConfig[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [newIncludeTags, setNewIncludeTags] = useState("");
    const [newExcludeTags, setNewExcludeTags] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("resume_pipelines");
        if (saved) {
            setPipelines(JSON.parse(saved));
        } else {
            const defaults: PipelineConfig[] = [
                {
                    name: "Full Stack Developer",
                    include_tags: [],
                    exclude_tags: [],
                    section_order: ["summary", "skills", "experience", "projects", "education"],
                    template_id: "modern"
                },
                {
                    name: "Backend Specialist",
                    include_tags: ["python", "java", "sql", "api", "docker"],
                    exclude_tags: ["css", "react", "frontend", "figma"],
                    section_order: ["summary", "skills", "experience", "projects", "education"],
                    template_id: "modern"
                },
                {
                    name: "SRE / DevOps",
                    include_tags: ["docker", "kubernetes", "linux", "ci/cd", "terraform"],
                    exclude_tags: ["react", "css", "ui", "frontend"],
                    section_order: ["summary", "skills", "projects", "experience", "education"],
                    template_id: "classic"
                }
            ];
            setPipelines(defaults);
            localStorage.setItem("resume_pipelines", JSON.stringify(defaults));
        }
    }, []);

    const handleSave = () => {
        if (!newName) return;
        const newPipeline: PipelineConfig = {
            name: newName,
            include_tags: newIncludeTags.split(",").map(t => t.trim()).filter(Boolean),
            exclude_tags: newExcludeTags.split(",").map(t => t.trim()).filter(Boolean),
            section_order: ["summary", "skills", "experience", "projects", "education"],
            template_id: "modern"
        };
        const updated = [...pipelines, newPipeline];
        setPipelines(updated);
        localStorage.setItem("resume_pipelines", JSON.stringify(updated));
        setIsCreating(false);
        setNewName("");
        setNewIncludeTags("");
        setNewExcludeTags("");
    };

    const handleDelete = (index: number) => {
        const updated = pipelines.filter((_, i) => i !== index);
        setPipelines(updated);
        localStorage.setItem("resume_pipelines", JSON.stringify(updated));
    };

    return (
        <div className="w-full h-full overflow-y-auto relative z-10">
            <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 pb-32">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
                                <span className="material-symbols-outlined text-xl">smart_toy</span>
                            </div>
                            <h2 className="font-serif text-3xl font-bold text-navy-900 dark:text-white">Resume Agents</h2>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg leading-relaxed">
                            Create AI-powered workflows that automatically filter your projects, reorder sections,
                            and tailor your resume for specific job roles — all in one click.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-navy-900 dark:bg-white text-white dark:text-navy-900 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.97] hover:scale-[1.02] shrink-0"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        New Agent
                    </button>
                </div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    {pipelines.map((p, i) => (
                        <div
                            key={i}
                            className="group relative bg-white dark:bg-[#151E2E] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-800/50 transition-all duration-300 overflow-hidden"
                        >
                            {/* Top accent bar */}
                            <div className={`h-1.5 w-full bg-gradient-to-r ${ACCENT_GRADIENTS[i % ACCENT_GRADIENTS.length]}`} />

                            <div className="p-5">
                                {/* Header row */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${ACCENT_GRADIENTS[i % ACCENT_GRADIENTS.length]} flex items-center justify-center text-white shadow-lg`}>
                                            <span className="material-symbols-outlined text-xl">{ICONS[i % ICONS.length]}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base text-navy-900 dark:text-white leading-tight">{p.name}</h3>
                                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[13px]">style</span>
                                                {p.template_id} template
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(i); }}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>

                                {/* Tags */}
                                <div className="space-y-3 mb-5">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px] text-teal-500">check_circle</span>
                                            Include Tags
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {p.include_tags.length > 0 ? p.include_tags.map(tag => (
                                                <span key={tag} className="px-2.5 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 text-[11px] font-semibold rounded-lg border border-teal-100 dark:border-teal-800/50">{tag}</span>
                                            )) : <span className="text-xs text-gray-400 italic">All projects included</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px] text-red-400">block</span>
                                            Exclude Tags
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {p.exclude_tags.length > 0 ? p.exclude_tags.map(tag => (
                                                <span key={tag} className="px-2.5 py-1 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 text-[11px] font-semibold rounded-lg border border-red-100 dark:border-red-800/50">{tag}</span>
                                            )) : <span className="text-xs text-gray-400 italic">None excluded</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Run button */}
                                <button
                                    onClick={() => onRunPipeline(p)}
                                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2
                                        bg-gradient-to-r ${ACCENT_GRADIENTS[i % ACCENT_GRADIENTS.length]} text-white shadow-lg hover:shadow-xl hover:brightness-110`}
                                >
                                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                                    Run Agent
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Empty State / Add More Card */}
                    {pipelines.length === 0 && (
                        <div
                            onClick={() => setIsCreating(true)}
                            className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl cursor-pointer hover:border-teal-400/50 hover:bg-teal-50/5 transition-all group"
                        >
                            <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-teal-500 group-hover:bg-teal-500/10 transition-colors mb-4">
                                <span className="material-symbols-outlined text-3xl">add</span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-500 group-hover:text-teal-500 transition-colors mb-1">Create Your First Agent</h3>
                            <p className="text-sm text-gray-400">Define filters to auto-tailor resumes for any role</p>
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE MODAL */}
            {isCreating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white dark:bg-[#151E2E] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 animate-in">

                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-teal-400 to-cyan-500 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-xl">smart_toy</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Configure New Agent</h3>
                                    <p className="text-teal-100 text-xs">Set up filters to tailor your resume automatically</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Agent Name</label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="e.g. Frontend Specialist, SRE Engineer..."
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Include Tags
                                    <span className="font-normal normal-case tracking-normal text-gray-400 dark:text-gray-500 ml-1">(comma separated)</span>
                                </label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="react, typescript, css, tailwind..."
                                    value={newIncludeTags}
                                    onChange={e => setNewIncludeTags(e.target.value)}
                                />
                                <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px]">info</span>
                                    Projects must have at least one of these tags to be included.
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Exclude Tags
                                    <span className="font-normal normal-case tracking-normal text-gray-400 dark:text-gray-500 ml-1">(comma separated)</span>
                                </label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="java, legacy, backend..."
                                    value={newExcludeTags}
                                    onChange={e => setNewExcludeTags(e.target.value)}
                                />
                                <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px]">info</span>
                                    Projects with any of these tags will be hidden from the resume.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 px-6 pb-6">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="flex-1 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!newName}
                                className="flex-1 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">save</span>
                                Save Agent
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
