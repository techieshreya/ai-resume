"use client";
import React from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is Resume.ai really free?",
    answer:
      "Yes! Our free plan includes 1 resume, basic templates, and PDF export. Upgrade to Pro for unlimited resumes and AI features.",
  },
  {
    question: "How does the AI writing assistant work?",
    answer:
      "Our AI analyzes your rough notes and transforms them into professional, ATS-optimized bullet points using advanced language models.",
  },
  {
    question: "What is ATS optimization?",
    answer:
      "ATS (Applicant Tracking System) optimization ensures your resume is formatted correctly to pass automated screening systems used by employers.",
  },
  {
    question: "Can I import my GitHub projects?",
    answer:
      "Absolutely! Connect your GitHub account and we'll automatically import your repositories, tech stack, and contributions.",
  },
  {
    question: "How does job matching work?",
    answer:
      "Paste a job description and our AI will analyze it against your resume, providing a match score and highlighting missing keywords.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-20 px-6 lg:px-8 bg-white dark:bg-gray-800 border-y border-[#E5E7EB] dark:border-[#374151] transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6366F1] font-bold tracking-wider uppercase text-xs mb-2 block">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Everything you need to know
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group p-6 rounded-xl bg-[#F9FAFB] dark:bg-gray-900 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 open:shadow-lg open:dark:bg-gray-900/80"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none outline-none">
                <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {faq.question}
                </span>
                <span className="text-gray-400 dark:text-gray-500 transition-transform duration-300 group-open:rotate-180 ml-4 flex-shrink-0">
                  <span className="material-symbols-outlined">
                    expand_more
                  </span>
                </span>
              </summary>
              <div className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4 text-sm">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}