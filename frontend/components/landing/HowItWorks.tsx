"use client";
import React from 'react';
import { Users, Sparkles, Rocket, LucideIcon } from 'lucide-react';

interface Step {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    step: '01',
    title: 'Import Your Data',
    description: 'Connect your GitHub account or manually enter your information. Our AI will help structure your content.',
    icon: Users
  },
  {
    step: '02',
    title: 'Customize & Enhance',
    description: 'Use our visual editor to refine your resume. Let AI transform your notes into professional descriptions.',
    icon: Sparkles
  },
  {
    step: '03',
    title: 'Match & Export',
    description: 'Paste a job description to get match scores and suggestions. Export your optimized resume as PDF.',
    icon: Rocket
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Create your perfect resume in 3 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((item, i) => (
            <div key={i} className="relative">
              {/* Connector Line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"></div>
              )}
              
              <div className="relative">
                {/* Step Number */}
                <div className="text-7xl font-black text-transparent bg-gradient-to-br from-blue-500/10 to-purple-500/10 bg-clip-text mb-4">
                  {item.step}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                  <item.icon size={28} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
