"use client";
import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-8">
            <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              AI-Powered Resume Builder
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Build Your Dream Resume in{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Minutes
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Create professional, ATS-optimized resumes with AI assistance. Match job descriptions, get instant feedback, and land your dream job faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/builder"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Start Building Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold transition-all duration-200"
            >
              See How It Works
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white dark:border-[#0A0A0A] flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300">10,000+ users</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Demo Preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="aspect-video flex items-center justify-center p-8">
              {/* Mock Interface Preview */}
              <div className="w-full h-full bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-white/10 p-6 flex gap-4">
                {/* Sidebar Mock */}
                <div className="w-1/4 bg-gray-100 dark:bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="h-3 bg-gray-300 dark:bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-white/10 rounded w-1/2"></div>
                  <div className="h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mt-4"></div>
                </div>
                {/* Content Mock */}
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-white/5 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-white/5 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 dark:bg-white/5 rounded w-4/6"></div>
                </div>
                {/* Preview Mock */}
                <div className="w-1/3 bg-gray-100 dark:bg-white/5 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
