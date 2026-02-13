"use client";
import React from "react";

interface Feature {
  icon: string;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
}

const features: Feature[] = [
  {
    icon: "bolt",
    title: "AI-Powered Writing",
    description:
      "Transform rough notes into professional bullet points with one click using advanced AI",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    icon: "target",
    title: "Job Matching",
    description:
      "Analyze job descriptions and get instant feedback on missing skills and keywords",
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    icon: "code",
    title: "Live Preview",
    description:
      "See your changes in real-time with instant PDF generation and formatting",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: "code_blocks",
    title: "GitHub Integration",
    description:
      "Automatically import your projects and contributions from GitHub",
    iconColor: "text-gray-700 dark:text-gray-300",
    iconBg: "bg-gray-100 dark:bg-gray-700/50",
  },
  {
    icon: "description",
    title: "ATS Optimization",
    description:
      "Ensure your resume passes Applicant Tracking Systems with smart formatting",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    icon: "trending_up",
    title: "Match Score",
    description:
      "Get a percentage match score against job descriptions to improve your chances",
    iconColor: "text-red-600",
    iconBg: "bg-red-50 dark:bg-red-900/20",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 px-6 lg:px-8 bg-white dark:bg-gray-800 border-y border-[#E5E7EB] dark:border-[#374151] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6366F1] font-bold tracking-wider uppercase text-xs mb-2 block">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to create the perfect resume
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-[#F9FAFB] dark:bg-gray-900 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center ${feature.iconColor} mb-4 group-hover:scale-110 transition-transform`}
              >
                <span className="material-symbols-outlined">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}