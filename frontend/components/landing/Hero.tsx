"use client";
import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-grid opacity-[0.03] dark:opacity-[0.05] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-[#6366F1] text-xs font-bold tracking-widest uppercase mb-6">
          <span className="material-symbols-outlined text-base">auto_awesome</span>
          AI-Powered Resume Builder
        </span>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-serif text-gray-900 dark:text-white leading-tight mb-8">
          Build Your Dream Resume in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-purple-600">
            Minutes
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-12 font-light">
          Create professional, ATS-optimized resumes with AI assistance. Match
          job descriptions, get instant feedback, and land your dream job faster.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group px-8 py-4 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Start Building Free
            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
          <a
            href="#features"
            className="px-8 py-4 rounded-xl bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold transition-all duration-200"
          >
            See How It Works
          </a>
        </div>

        {/* Social Proof */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["DC", "SM", "MJ", "ER"].map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-purple-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold"
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              10,000+ users
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="material-symbols-outlined text-yellow-400 text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            ))}
            <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
              4.9/5 rating
            </span>
          </div>
        </div>

        {/* Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-20">
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
  );
}
