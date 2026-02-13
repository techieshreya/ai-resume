"use client";
import React from "react";
import Link from "next/link";

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
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "1 Resume",
      "Basic Templates",
      "PDF Export",
      "GitHub Integration",
      "Community Support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For serious job seekers",
    features: [
      "Unlimited Resumes",
      "Premium Templates",
      "AI Writing Assistant",
      "Job Matching",
      "ATS Optimization",
      "Priority Support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$29",
    period: "per month",
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Team Collaboration",
      "Custom Branding",
      "API Access",
      "Dedicated Support",
      "Analytics Dashboard",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 lg:px-8 bg-[#F9FAFB] dark:bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6366F1] font-bold tracking-wider uppercase text-xs mb-2 block">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose the plan that works for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${plan.popular
                  ? "bg-gradient-to-br from-[#6366F1] to-purple-700 border-transparent text-white scale-105"
                  : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
                }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-yellow-400 text-gray-900 text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    emoji_events
                  </span>
                  MOST POPULAR
                </div>
              )}

              <h3
                className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mb-6 ${plan.popular
                    ? "text-indigo-100"
                    : "text-gray-500 dark:text-gray-400"
                  }`}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span
                  className={`text-5xl font-black ${plan.popular ? "text-white" : "text-gray-900 dark:text-white"
                    }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm ml-2 ${plan.popular
                      ? "text-indigo-100"
                      : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                  {plan.period}
                </span>
              </div>

              {/* CTA */}
              <Link
                href="/signup"
                className={`block w-full py-3 rounded-xl font-semibold text-center mb-8 transition-all duration-200 hover:scale-105 active:scale-95 ${plan.popular
                    ? "bg-white text-[#6366F1] hover:bg-gray-100"
                    : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                  }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-lg ${plan.popular ? "text-indigo-100" : "text-[#10B981]"
                        }`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span
                      className={`text-sm ${plan.popular
                          ? "text-indigo-50"
                          : "text-gray-700 dark:text-gray-300"
                        }`}
                    >
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
