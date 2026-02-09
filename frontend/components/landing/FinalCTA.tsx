"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl md:text-5xl font-black mb-6">
          Ready to Build Your Resume?
        </h2>
        <p className="text-xl text-blue-100 dark:text-blue-200 mb-10 leading-relaxed">
          Join thousands of job seekers who landed their dream jobs with Resume.ai
        </p>
        <Link
          href="/builder"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Get Started for Free
          <ArrowRight size={20} />
        </Link>
        <p className="mt-6 text-sm text-blue-100 dark:text-blue-200">
          No credit card required • Free forever plan available
        </p>
      </div>
    </section>
  );
}
