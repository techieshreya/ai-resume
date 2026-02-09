"use client";
import React from 'react';
import { Zap, Target, Code, Github, FileText, TrendingUp, LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: 'AI-Powered Writing',
    description: 'Transform rough notes into professional bullet points with one click using advanced AI',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Target,
    title: 'Job Matching',
    description: 'Analyze job descriptions and get instant feedback on missing skills and keywords',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Code,
    title: 'Live Preview',
    description: 'See your changes in real-time with instant PDF generation and formatting',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Github,
    title: 'GitHub Integration',
    description: 'Automatically import your projects and contributions from GitHub',
    color: 'from-gray-700 to-gray-900'
  },
  {
    icon: FileText,
    title: 'ATS Optimization',
    description: 'Ensure your resume passes Applicant Tracking Systems with smart formatting',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: TrendingUp,
    title: 'Match Score',
    description: 'Get a percentage match score against job descriptions to improve your chances',
    color: 'from-red-500 to-rose-500'
  }
];

export default function Features() {
  return (
    // 1. Changed dark background to #0A0A0A to match your other pages
    <section id="features" className="py-20 px-6 lg:px-8 bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          {/* 2. ADDED dark:text-white explicitly here */}
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to create the perfect resume
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              // 3. Updated Card Background:
              // - Light Mode: bg-white
              // - Dark Mode: bg-white/5 (Glass effect)
              className="group p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-blue-500/20 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={24} className="text-white" />
              </div>
              {/* 4. Ensure Title is white in dark mode */}
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              {/* 5. Ensure Text is readable gray in dark mode */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}