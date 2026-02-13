"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const teamMembers = [
    {
        name: "David Chen",
        role: "Co-Founder & CEO",
        bio: "Ex-Google engineer passionate about democratizing career tools.",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD6jycae1rn3rZduw7khNlNtnwcRMfPRGR2Xs-YVSoViqjz_C_eraqBTMYGIf30v0BdFfoNTbBsjO7S--sudwgt7KVbzq7h8xMb8qGeFVyI6DpsCcme2r2vZvDAbzhBMVTn35O3YoXrV5s_y59jGzBwVnbo3PyW3dimzE46jz5IlGReNmudOTQy0ovzxj6a76BzGNfTvaFfSXNEU1YawifD_8vsfeWg0Al7_P3Npad6Oa1G8TM5nrm2UrnXmZhoac0IVooWVeHLBkI",
    },
    {
        name: "Sarah Miller",
        role: "Head of Product",
        bio: "Product visionary with a background in HR tech and UX research.",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAu_T9ErR60HKO2SDWP-QM9dkbGm3c-zeqyy80H1GDISy_RnL91fEG_WkJfpqBVfnHgFcwMQCLEeLEAXs9huuo-cOrVYaWXUCENUO36aKh4LXl3OckUmyo5yK9HibgBBtok90a_qch7IarQJIch4rB5HDCHhnP5Tu3Cq6wW-LGo2WtilAaF3vkunAmxVDYsfa3EawmZ45sLHeB9frd8_TxL_rbKXPdVUg8EuEgCusn2I9PVwPn7afrbacBmDlzvM7O3dizURq5YcM0",
    },
    {
        name: "Marcus Johnson",
        role: "Lead AI Engineer",
        bio: "PhD in NLP specializing in semantic understanding and generation.",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBHt9HpRP9BVR6iXFUC8J37gW1pvHjfR8TIATjskCrctWCl_Wn7yTnOIg7ViWG7ff5Cdfz7Tdnj3mc1WGCAGHvku2q5iJAH9_0T4jM0wmpAt1duSW54DDRqcyJUIOx6S31XXyaXWGTRtVN4j9uJjOwDZTvFhXNrWwQh34ddJ3EqEDwWdG2SCEN1ud7PLF-toUlE5CX_aXMqJ6ltwMvxuAZmHHFD5J1ye3HmrlN6Q42ZXhe0Duvgj0NHwPlt1nP4n14DcQmMo7WI1uE",
    },
    {
        name: "Elena Rodriguez",
        role: "Design Lead",
        bio: "Award-winning designer focused on accessible and inclusive interfaces.",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDQa8PI4FCyuKQUUNxRz0qy1upKC9AYaEYBqqeYkOicMjP3NQK_Wo-eAfq5GzFL51DzybnaPX9JLdDzTCvsZT6Y2johBtQMTTjlAwh3AktyEG0NZKWktriJx61PEpm8ww7C2eo_gB6MYl9_JI_ZRmL3FvANt6qG3juFMIVvKWcVcxxtqsPXLettDaHgWt7C6bH_jhO228SPba6cEkeUTcI80Ah4AYxyUwS-6zwX7duF-jeJ61fD-X3Sk-Muw9K7e2VE0uQq8tjMC4U",
    },
];

const flowchartSteps = [
    {
        icon: "input",
        title: "Raw Input",
        desc: "User provides job history, skills, and unstructured notes.",
        highlight: false,
        hoverColor: "group-hover:border-[#6366F1] group-hover:text-[#6366F1]",
    },
    {
        icon: "psychology",
        title: "NLP Analysis",
        desc: "AI parses context, identifies action verbs, and measures impact.",
        highlight: false,
        hoverColor: "group-hover:border-purple-500 group-hover:text-purple-500",
    },
    {
        icon: "auto_fix_high",
        title: "Optimization",
        desc: "Content is rewritten for clarity, ATS compatibility, and tone.",
        highlight: true,
        hoverColor: "",
    },
    {
        icon: "description",
        title: "Final Polish",
        desc: "Formatted into a perfect PDF with design best practices.",
        highlight: false,
        hoverColor: "group-hover:border-[#10B981] group-hover:text-[#10B981]",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB] dark:bg-[#111827] text-gray-800 dark:text-gray-200">
            <Navbar />

            {/* Mission Section */}
            <section className="relative pt-24 pb-20 overflow-hidden">
                <div className="absolute inset-0 pattern-grid opacity-[0.03] dark:opacity-[0.05] pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-[#6366F1] text-xs font-bold tracking-widest uppercase mb-6">
                        Our Mission
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif text-gray-900 dark:text-white leading-tight mb-8">
                        Empowering careers through{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-purple-600">
                            intelligent design.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-12 font-light">
                        We believe that everyone deserves a resume that truly represents
                        their potential. By combining human creativity with AI precision,
                        we&apos;re leveling the playing field for job seekers worldwide.
                    </p>

                    {/* Value Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
                        {[
                            {
                                icon: "visibility",
                                iconColor: "text-blue-600",
                                iconBg: "bg-blue-50 dark:bg-blue-900/20",
                                title: "Transparency First",
                                desc: "Our AI doesn't just generate text; it explains why. We believe in white-box AI that educates users while it assists them.",
                            },
                            {
                                icon: "handshake",
                                iconColor: "text-purple-600",
                                iconBg: "bg-purple-50 dark:bg-purple-900/20",
                                title: "Human-AI Partnership",
                                desc: "Technology should amplify human potential, not replace it. You control the narrative; we handle the formatting and optimization.",
                            },
                            {
                                icon: "lock",
                                iconColor: "text-emerald-600",
                                iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
                                title: "Data Privacy",
                                desc: "Your career history is personal. We employ enterprise-grade encryption and never sell your data to third-party recruiters.",
                            },
                        ].map((card, i) => (
                            <div
                                key={i}
                                className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div
                                    className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center ${card.iconColor} mb-4 group-hover:scale-110 transition-transform`}
                                >
                                    <span className="material-symbols-outlined">{card.icon}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {card.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {card.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Flowchart Section */}
            <section className="py-20 bg-white dark:bg-gray-800 border-y border-[#E5E7EB] dark:border-[#374151]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif text-gray-900 dark:text-white mb-4">
                            The Tech Behind the Magic
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            How our proprietary Natural Language Processing engine transforms
                            your raw experience into a polished professional story.
                        </p>
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2 md:hidden"></div>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative z-10">
                            {flowchartSteps.map((step, i) => (
                                <div
                                    key={i}
                                    className={`w-full md:w-64 p-6 rounded-xl text-center relative group ${step.highlight
                                            ? "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                            : "bg-[#F9FAFB] dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                                        }`}
                                >
                                    {step.highlight && (
                                        <div className="absolute -top-3 -right-3">
                                            <span className="flex h-6 w-6 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-6 w-6 bg-indigo-500"></span>
                                            </span>
                                        </div>
                                    )}
                                    <div
                                        className={`w-12 h-12 mx-auto rounded-full shadow-sm flex items-center justify-center mb-4 border transition-colors ${step.highlight
                                                ? "bg-white dark:bg-gray-800 border-indigo-100 dark:border-indigo-700 text-[#6366F1]"
                                                : `bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 ${step.hoverColor}`
                                            }`}
                                    >
                                        <span className="material-symbols-outlined">
                                            {step.icon}
                                        </span>
                                    </div>
                                    <h4
                                        className={`font-bold mb-2 ${step.highlight
                                                ? "text-[#6366F1] dark:text-indigo-400"
                                                : "text-gray-900 dark:text-white"
                                            }`}
                                    >
                                        {step.title}
                                    </h4>
                                    <p
                                        className={`text-xs ${step.highlight
                                                ? "text-gray-600 dark:text-gray-400"
                                                : "text-gray-500"
                                            }`}
                                    >
                                        {step.desc}
                                    </p>
                                    {i < flowchartSteps.length - 1 && (
                                        <div className="hidden md:block absolute top-1/2 -right-6 w-8 h-0.5 bg-gray-200 dark:bg-gray-600 flowchart-arrow"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-[#F9FAFB] dark:bg-[#111827]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-[#6366F1] font-bold tracking-wider uppercase text-xs mb-2 block">
                                The People
                            </span>
                            <h2 className="text-3xl font-serif text-gray-900 dark:text-white">
                                Meet the Team
                            </h2>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mt-4 md:mt-0 text-sm">
                            A diverse group of engineers, designers, and career coaches
                            working together to redefine how people get hired.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, i) => (
                            <div key={i} className="group">
                                <div className="aspect-square mb-4 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700 relative">
                                    <img
                                        alt={member.name}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                                        src={member.image}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <div className="flex space-x-3 text-white">
                                            <a
                                                className="hover:text-[#6366F1] transition-colors"
                                                href="#"
                                            >
                                                <span className="material-symbols-outlined text-lg">
                                                    link
                                                </span>
                                            </a>
                                            <a
                                                className="hover:text-[#6366F1] transition-colors"
                                                href="#"
                                            >
                                                <span className="material-symbols-outlined text-lg">
                                                    mail
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-[#6366F1] font-medium">
                                    {member.role}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
