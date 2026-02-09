"use client";
import React from 'react';

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: '10K+', label: 'Active Users' },
  { value: '50K+', label: 'Resumes Created' },
  { value: '85%', label: 'Success Rate' },
  { value: '4.9/5', label: 'User Rating' }
];

export default function Stats() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((stat, i) => (
            <div key={i} className="p-6">
              <div className="text-5xl font-black mb-2">{stat.value}</div>
              <div className="text-blue-100 dark:text-blue-200 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
