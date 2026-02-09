"use client";
import React from 'react';
import { ChevronDown } from 'lucide-react'; // Changed to Chevron for better UI

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Is Resume.ai really free?',
    answer: 'Yes! Our free plan includes 1 resume, basic templates, and PDF export. Upgrade to Pro for unlimited resumes and AI features.'
  },
  {
    question: 'How does the AI writing assistant work?',
    answer: 'Our AI analyzes your rough notes and transforms them into professional, ATS-optimized bullet points using advanced language models.'
  },
  {
    question: 'What is ATS optimization?',
    answer: 'ATS (Applicant Tracking System) optimization ensures your resume is formatted correctly to pass automated screening systems used by employers.'
  },
  {
    question: 'Can I import my GitHub projects?',
    answer: 'Absolutely! Connect your GitHub account and we\'ll automatically import your repositories, tech stack, and contributions.'
  },
  {
    question: 'How does job matching work?',
    answer: 'Paste a job description and our AI will analyze it against your resume, providing a match score and highlighting missing keywords.'
  }
];

export default function FAQ() {
  return (
    // 1. Updated background to #0A0A0A to match other sections
    <section id="faq" className="py-20 px-6 lg:px-8 bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          {/* 2. Added dark:text-white explicitly */}
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              // 3. Simplified background to dark:bg-white/5 for consistent glass look
              className="group p-6 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 open:shadow-lg open:dark:bg-white/10"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none outline-none">
                <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  {faq.question}
                </span>
                
                {/* 4. Icon rotation logic */}
                <span className="text-gray-400 dark:text-gray-500 transition-transform duration-300 group-open:rotate-180">
                  <ChevronDown size={20} />
                </span>
              </summary>
              
              <div className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-4">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}