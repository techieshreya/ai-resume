"use client";
import React from "react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  initials: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    initials: "SJ",
    text: "This tool helped me land my dream job at Google! The AI suggestions were spot-on and the job matching feature saved me hours.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "Microsoft",
    initials: "MC",
    text: "The best resume builder I've used. The live preview and ATS optimization made all the difference in my job search.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist",
    company: "Amazon",
    initials: "ER",
    text: "I got 3x more interview calls after using Resume.ai. The match score feature is a game-changer!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-white dark:bg-gray-800 border-y border-[#E5E7EB] dark:border-[#374151]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6366F1] font-bold tracking-wider uppercase text-xs mb-2 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied job seekers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-[#F9FAFB] dark:bg-gray-900 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <span
                    key={j}
                    className="material-symbols-outlined text-yellow-400 text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic text-sm">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366F1] to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
