"use client";
import React from 'react';
import Link from 'next/link';
import { CheckCircle, Award } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1 Resume',
      'Basic Templates',
      'PDF Export',
      'GitHub Integration',
      'Community Support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    description: 'For serious job seekers',
    features: [
      'Unlimited Resumes',
      'Premium Templates',
      'AI Writing Assistant',
      'Job Matching',
      'ATS Optimization',
      'Priority Support'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$29',
    period: 'per month',
    description: 'For teams and agencies',
    features: [
      'Everything in Pro',
      'Team Collaboration',
      'Custom Branding',
      'API Access',
      'Dedicated Support',
      'Analytics Dashboard'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose the plan that works for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-transparent text-white scale-105'
                  : 'bg-white dark:bg-gradient-to-br dark:from-white/5 dark:to-white/[0.02] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-yellow-400 text-gray-900 text-xs font-bold flex items-center gap-1">
                  <Award size={12} />
                  MOST POPULAR
                </div>
              )}

              {/* Plan Name */}
              <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className={`text-5xl font-black ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ml-2 ${plan.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {plan.period}
                </span>
              </div>

              {/* CTA Button */}
              <Link
                href="/builder"
                className={`block w-full py-3 rounded-xl font-bold text-center mb-8 transition-all duration-200 hover:scale-105 active:scale-95 ${
                  plan.popular
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features List */}
              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <CheckCircle size={18} className={plan.popular ? 'text-blue-100' : 'text-green-500'} />
                    <span className={`text-sm ${plan.popular ? 'text-blue-50' : 'text-gray-700 dark:text-gray-300'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
