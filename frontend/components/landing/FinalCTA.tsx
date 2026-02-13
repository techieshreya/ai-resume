"use client";
import React from "react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-[#6366F1] to-purple-700 dark:from-indigo-900 dark:to-purple-900">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
          Ready to Build Your Resume?
        </h2>
        <p className="text-xl text-indigo-100 dark:text-indigo-200 mb-10 leading-relaxed">
          Join thousands of job seekers who landed their dream jobs with
          Resume.ai
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#6366F1] hover:bg-gray-100 font-semibold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Get Started for Free
          <span className="material-symbols-outlined text-xl">
            arrow_forward
          </span>
        </Link>
        <p className="mt-6 text-sm text-indigo-100 dark:text-indigo-200">
          No credit card required • Free forever plan available
        </p>
      </div>
    </section>
  );
}
