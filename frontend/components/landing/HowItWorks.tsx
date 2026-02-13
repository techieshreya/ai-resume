"use client";
import React from "react";

interface Step {
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
  hoverColor: string;
}

const steps: Step[] = [
  {
    icon: "input",
    title: "Raw Input",
    description: "User provides job history, skills, and unstructured notes.",
    hoverColor: "group-hover:border-[#6366F1] group-hover:text-[#6366F1]",
  },
  {
    icon: "psychology",
    title: "NLP Analysis",
    description: "AI parses context, identifies action verbs, and measures impact.",
    hoverColor: "group-hover:border-purple-500 group-hover:text-purple-500",
  },
  {
    icon: "auto_fix_high",
    title: "Optimization",
    description: "Content is rewritten for clarity, ATS compatibility, and tone.",
    highlight: true,
    hoverColor: "",
  },
  {
    icon: "description",
    title: "Final Polish",
    description: "Formatted into a perfect PDF with design best practices.",
    hoverColor: "group-hover:border-[#10B981] group-hover:text-[#10B981]",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-[#F9FAFB] dark:bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6366F1] font-bold tracking-wider uppercase text-xs mb-2 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 dark:text-white mb-4">
            The Tech Behind the Magic
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            How our NLP engine transforms your raw experience into a polished
            professional story.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical line for mobile */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2 md:hidden"></div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative z-10">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`w-full md:w-64 p-6 rounded-xl text-center relative group transition-all duration-300 ${step.highlight
                    ? "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                  }`}
              >
                {/* Ping indicator for highlighted step */}
                {step.highlight && (
                  <div className="absolute -top-3 -right-3">
                    <span className="flex h-6 w-6 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-indigo-500"></span>
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-12 h-12 mx-auto rounded-full shadow-sm flex items-center justify-center mb-4 border transition-colors ${step.highlight
                      ? "bg-white dark:bg-gray-800 border-indigo-100 dark:border-indigo-700 text-[#6366F1]"
                      : `bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 ${step.hoverColor}`
                    }`}
                >
                  <span className="material-symbols-outlined">{step.icon}</span>
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
                  {step.description}
                </p>

                {/* Connector Arrow (desktop only, not on last item) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-8 h-0.5 bg-gray-200 dark:bg-gray-600 flowchart-arrow"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
